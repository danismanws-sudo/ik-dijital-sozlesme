// Receives the completed form, stores everything in the company Google Drive
// and notifies HR by e-mail:
//   Sözleşmeler/            signed contract  "Ad Soyad - TC.pdf"
//   KVKK/                   signed KVKK text "Ad Soyad - TC - KVKK.pdf"
//   Evraklar/Ad Soyad - TC/ ID front/back and criminal record
//   GÜNLÜK SÖZLEŞMELER EXCEL/  one spreadsheet per day, one row per submission
import type { NextApiRequest, NextApiResponse } from 'next';
import { ValidationError } from 'yup';
import { serverSchema } from '../../lib/validationSchema';
import { signContract, signKvkk } from '../../lib/pdf';
import {
  SHEET_MIME,
  appendRow,
  createFile,
  ensureFolder,
  exportXlsx,
  findByTag,
  getColumn,
  isGoogleConfigured,
  sendMail,
  uploadFile,
  writeHeader,
} from '../../lib/google';

export const config = { api: { bodyParser: { sizeLimit: '4.5mb' } } };

type UploadedFile = { name: string; type: string; data: string };
type Payload = { values: Record<string, any>; files: Record<'idFront' | 'idBack' | 'criminalRecord', UploadedFile> };

const ROOT_FOLDER = 'Detay İK Dijital Sözleşme';
const ALLOWED_TYPES: Record<string, string> = { 'image/jpeg': 'jpg', 'image/png': 'png', 'application/pdf': 'pdf' };
const MAX_FILE_BYTES = 3 * 1024 * 1024;

// Column order must match the row written in the handler below.
export const SHEET_COLUMNS = [
  { title: 'Kayıt Zamanı', width: 125 },
  { title: 'İşe Giriş Tarihi', width: 105 },
  { title: 'İsim Soyisim', width: 170 },
  { title: 'TC Kimlik', width: 110 },
  { title: 'Telefon', width: 130 },
  { title: 'Doğum Tarihi', width: 100 },
  { title: 'Sorumlu Yönetici', width: 150 },
  { title: 'Durumu', width: 75 },
  { title: 'Oturduğu Semt', width: 130 },
  { title: 'IBAN', width: 235 },
  { title: 'Proje / Mağaza', width: 170 },
  { title: 'İş Başlangıç Tarihi', width: 105 },
  { title: 'İş Bitiş Tarihi', width: 100 },
  { title: 'Sözleşme Onayı', width: 85 },
  { title: 'Beyan Onayı', width: 80 },
  { title: 'KVKK Onayı', width: 80 },
  { title: 'Kimlik Ön Yüz', width: 95 },
  { title: 'Kimlik Arka Yüz', width: 95 },
  { title: 'Adli Sicil', width: 90 },
  { title: 'Sözleşme PDF', width: 95 },
  { title: 'KVKK PDF', width: 90 },
];
const TC_COLUMN = 'D';

class HttpError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

function istanbulNow() {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Europe/Istanbul',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
      .formatToParts(new Date())
      .map((p) => [p.type, p.value])
  );
  const date = `${parts.day}.${parts.month}.${parts.year}`;
  return { date, time: `${parts.hour}:${parts.minute}`, dayKey: `${parts.year}-${parts.month}-${parts.day}` };
}

const safeName = (text: string) => text.replace(/[\\/:*?"<>|]+/g, ' ').replace(/\s+/g, ' ').trim();

function decodeFile(file: UploadedFile | undefined, label: string) {
  if (!file?.data) throw new HttpError(400, `${label} eksik`);
  const ext = ALLOWED_TYPES[file.type];
  if (!ext) throw new HttpError(400, `${label} yalnızca JPG, PNG veya PDF olabilir`);
  const data = Buffer.from(file.data, 'base64');
  if (data.length > MAX_FILE_BYTES) throw new HttpError(400, `${label} çok büyük (en fazla 3 MB)`);
  return { data, type: file.type, ext };
}

async function dailySheet(date: string, dayKey: string, parentId: string) {
  const existing = await findByTag('ikDay', dayKey, parentId);
  if (existing) return existing;
  const sheet = await createFile({
    name: `${date} - Personel Detay Formu`,
    mimeType: SHEET_MIME,
    parentId,
    appProperties: { ikDay: dayKey },
  });
  await writeHeader(sheet.id, SHEET_COLUMNS, 3);
  return sheet;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Yalnızca POST' });
  if (!isGoogleConfigured()) {
    return res.status(503).json({ error: 'Sunucu henüz yapılandırılmadı. Lütfen İK ile iletişime geçin.' });
  }

  try {
    const { values: raw, files } = (req.body || {}) as Payload;
    let v: Record<string, any>;
    try {
      v = await serverSchema.validate(raw, { abortEarly: false, stripUnknown: true });
    } catch (e) {
      if (e instanceof ValidationError) throw new HttpError(400, e.errors.join(', '));
      throw e;
    }
    const idFront = decodeFile(files?.idFront, 'Kimlik ön yüzü');
    const idBack = decodeFile(files?.idBack, 'Kimlik arka yüzü');
    const criminalRecord = decodeFile(files?.criminalRecord, 'Adli sicil kaydı');
    const signaturePng = Buffer.from(String(v.signature).replace(/^data:image\/png;base64,/, ''), 'base64');

    const now = istanbulNow();
    const person = safeName(`${v.fullName} - ${v.tcNo}`);

    // Folders are found by tag, so renaming or moving them in Drive is safe.
    const root = await ensureFolder('root', ROOT_FOLDER);
    const [contracts, kvkk, documents, daily] = await Promise.all([
      ensureFolder('sozlesmeler', 'Sözleşmeler', root.id),
      ensureFolder('kvkk', 'KVKK', root.id),
      ensureFolder('evraklar', 'Evraklar', root.id),
      ensureFolder('gunluk', 'GÜNLÜK SÖZLEŞMELER EXCEL', root.id),
    ]);

    // Same rule as the old n8n flow: one record per TC per day.
    const sheet = await dailySheet(now.date, now.dayKey, daily.id);
    const registeredTcs = await getColumn(sheet.id, TC_COLUMN);
    if (registeredTcs.includes(v.tcNo)) {
      throw new HttpError(409, 'Bu TC kimlik numarası ile bugün zaten kayıt yapılmış.');
    }

    const signature = {
      signaturePng,
      signedAt: `${now.date} ${now.time}`,
      rows: [
        ['Ad Soyad', v.fullName],
        ['T.C. Kimlik No', v.tcNo],
        ['Telefon', `+90 ${v.phone}`],
        ['Doğum Tarihi', v.birthDate],
        ['Proje / Mağaza', v.projectName],
        ['İş Başlangıç', v.startDate],
        ['İş Bitiş', v.endDate],
        ['Onay Tarihi', `${now.date} ${now.time}`],
      ] as [string, string][],
    };
    const [contractPdf, kvkkPdf] = await Promise.all([
      signContract({ ...signature, title: 'İŞÇİ BİLGİLERİ VE ONAYI' }),
      signKvkk({ ...signature, title: 'İLGİLİ KİŞİ BİLGİLERİ VE ONAYI' }),
    ]);

    const personFolder = await createFile({
      name: person,
      mimeType: 'application/vnd.google-apps.folder',
      parentId: documents.id,
    });
    const [contractFile, kvkkFile, frontFile, backFile, recordFile] = await Promise.all([
      uploadFile(`${person}.pdf`, 'application/pdf', contractPdf, contracts.id),
      uploadFile(`${person} - KVKK.pdf`, 'application/pdf', kvkkPdf, kvkk.id),
      uploadFile(`Kimlik Ön Yüz.${idFront.ext}`, idFront.type, idFront.data, personFolder.id),
      uploadFile(`Kimlik Arka Yüz.${idBack.ext}`, idBack.type, idBack.data, personFolder.id),
      uploadFile(`Adli Sicil.${criminalRecord.ext}`, criminalRecord.type, criminalRecord.data, personFolder.id),
    ]);

    await appendRow(sheet.id, [
      `${now.date} ${now.time}`,
      v.hireDate,
      v.fullName,
      v.tcNo,
      `+90 ${v.phone}`,
      v.birthDate,
      v.managerName,
      v.status,
      v.district,
      v.iban,
      v.projectName,
      v.startDate,
      v.endDate,
      'Evet',
      'Evet',
      'Evet',
      { link: frontFile.webViewLink || '', label: 'Görüntüle' },
      { link: backFile.webViewLink || '', label: 'Görüntüle' },
      { link: recordFile.webViewLink || '', label: 'Görüntüle' },
      { link: contractFile.webViewLink || '', label: 'Sözleşme' },
      { link: kvkkFile.webViewLink || '', label: 'KVKK' },
    ]);

    // The record is saved at this point; a failed e-mail must not make the employee resubmit.
    const recipients = (process.env.MAIL_TO || '').split(',').map((s) => s.trim()).filter(Boolean);
    if (recipients.length) {
      try {
        await sendMail({
          to: recipients,
          fromName: 'Detay İK Dijital Sözleşme',
          subject: `Yeni Personel Kaydı: ${v.fullName}`,
          html: notificationHtml(v.fullName, v.district, `https://docs.google.com/spreadsheets/d/${sheet.id}/edit`),
          attachments: [
            {
              filename: `${now.date} - Personel Detay Formu.xlsx`,
              mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
              data: await exportXlsx(sheet.id),
            },
          ],
        });
      } catch (e) {
        console.error('Bildirim e-postası gönderilemedi:', e);
      }
    }

    return res.status(200).json({ ok: true });
  } catch (e: any) {
    if (e instanceof HttpError) return res.status(e.status).json({ error: e.message });
    console.error('Form kaydedilemedi:', e);
    return res.status(500).json({ error: 'Kayıt sırasında bir hata oluştu. Lütfen biraz sonra tekrar deneyin.' });
  }
}

const escapeHtml = (text: string) =>
  text.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));

function notificationHtml(fullName: string, district: string, sheetUrl: string) {
  return `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px; border-radius: 10px;">
  <div style="text-align: center; background-color: #f4f4f4; padding: 10px; border-radius: 5px; margin-bottom: 20px;">
    <h2 style="color: #333; margin: 0;">Yeni Personel Kayıt Bildirimi</h2>
    <p style="color: #666; margin: 5px 0 0 0;">Web sitesinden yeni bir form dolduruldu.</p>
  </div>
  <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
    <tr><td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold; width: 40%;">İsim Soyisim:</td><td style="padding: 10px; border-bottom: 1px solid #eee;">${escapeHtml(fullName)}</td></tr>
    <tr><td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Oturduğu Semt:</td><td style="padding: 10px; border-bottom: 1px solid #eee;">${escapeHtml(district)}</td></tr>
  </table>
  <div style="margin-top: 20px; padding: 20px; background-color: #f9f9f9; border-radius: 5px; text-align: center;">
    <h4 style="margin-top: 0; text-align: left; color: #333;">Günlük Tablo</h4>
    <p style="margin-top: 5px; text-align: left; margin-bottom: 25px;">Aşağıdaki bağlantıdan güncel kayıt tablosuna canlı olarak ulaşabilirsiniz:</p>
    <a href="${sheetUrl}" target="_blank" style="background-color: #27409a; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Canlı Tabloyu Görüntüle</a>
    <p style="margin-top: 30px; font-weight: bold; color: #444;">Excel hali mailin ekinde yer almaktadır.</p>
  </div>
  <div style="text-align: center; color: #888; font-size: 12px; margin-top: 30px; border-top: 1px solid #eee; padding-top: 10px;">
    Bu mail otomatik olarak oluşturulmuştur. Lütfen cevaplamayınız.
  </div>
</div>`;
}
