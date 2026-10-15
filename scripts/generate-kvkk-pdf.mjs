// Generates public/belgeler/kvkk-aydinlatma-metni.pdf from the text below.
// Run after editing the text:  node scripts/generate-kvkk-pdf.mjs
// The bottom of the last page is left empty: the signed copy gets its
// signature block stamped there (see lib/pdf.ts).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PDFDocument, rgb } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.join(root, 'public', 'belgeler', 'kvkk-aydinlatma-metni.pdf');

const COMPANY = 'Detay Envanter Stok Sayım Danışmanlık Hizmetleri Ltd. Şti.';
const ADDRESS = 'Merdivenköy Mah. Bora Sk. Nidakule Göztepe No:1-3/23 Kadıköy/İstanbul';
const EMAIL = 'info@detaystoksayim.com';

// Each entry: ['h', text] heading, ['p', text] paragraph, ['li', text] bullet.
const content = [
  ['title', 'KİŞİSEL VERİLERİN KORUNMASI HAKKINDA AYDINLATMA METNİ VE AÇIK RIZA BEYANI'],
  ['p', `6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") uyarınca, veri sorumlusu sıfatıyla ${COMPANY} ("Şirket") olarak, işe giriş sürecinde elektronik form aracılığıyla paylaştığınız kişisel verilerinizin hangi amaçlarla ve nasıl işlendiği hakkında sizi bilgilendirmek isteriz.`],
  ['h', '1. VERİ SORUMLUSU'],
  ['p', `${COMPANY} — Adres: ${ADDRESS} — E-posta: ${EMAIL}`],
  ['h', '2. İŞLENEN KİŞİSEL VERİLERİNİZ'],
  ['li', 'Kimlik bilgileri: Ad soyad, T.C. kimlik numarası, doğum tarihi, kimlik kartı ön ve arka yüz görüntüsü.'],
  ['li', 'İletişim bilgileri: Cep telefonu numarası, oturduğunuz semt.'],
  ['li', 'Finansal bilgiler: IBAN numarası.'],
  ['li', 'Özlük ve mesleki bilgiler: İşe giriş tarihi, çalışılacak proje/mağaza, iş başlangıç ve bitiş tarihleri, sorumlu yönetici, çalışma durumu.'],
  ['li', 'Ceza mahkûmiyeti ve güvenlik tedbirlerine ilişkin veriler (özel nitelikli kişisel veri): Adli sicil kaydı.'],
  ['li', 'Diğer: Elektronik ortamda çizilen imzanız, form gönderim tarihi ve saati.'],
  ['h', '3. KİŞİSEL VERİLERİN İŞLENME AMAÇLARI'],
  ['li', 'Belirli süreli (proje bazlı) iş sözleşmesinin kurulması ve ifası,'],
  ['li', 'Sosyal Güvenlik Kurumu işe giriş/çıkış bildirimlerinin ve diğer yasal bildirimlerin yapılması,'],
  ['li', 'Ücret ve hakediş ödemelerinin banka yoluyla yapılması,'],
  ['li', 'İş ve sosyal güvenlik mevzuatından doğan yükümlülüklerin yerine getirilmesi,'],
  ['li', 'Hizmet verilen mağaza ve depo sahalarına giriş ile iş güvenliğinin sağlanması,'],
  ['li', 'Olası hukuki uyuşmazlıklarda hakların tesisi, kullanılması ve korunması.'],
  ['h', '4. HUKUKİ SEBEPLER VE TOPLAMA YÖNTEMİ'],
  ['p', 'Kişisel verileriniz, Şirket\'in internet sitesinde yer alan elektronik form aracılığıyla otomatik yolla toplanmaktadır. Verileriniz KVKK\'nın 5. maddesinde yer alan; kanunlarda açıkça öngörülmesi, bir sözleşmenin kurulması veya ifasıyla doğrudan ilgili olması, veri sorumlusunun hukuki yükümlülüğünü yerine getirebilmesi, bir hakkın tesisi, kullanılması veya korunması ve veri sorumlusunun meşru menfaati hukuki sebeplerine dayanılarak işlenmektedir. Adli sicil kaydınız ise KVKK\'nın 6. maddesinde öngörülen şartlar çerçevesinde ve gerektiği ölçüde açık rızanıza dayanılarak işlenmektedir.'],
  ['h', '5. KİŞİSEL VERİLERİN AKTARILMASI'],
  ['p', 'Kişisel verileriniz yukarıdaki amaçlarla sınırlı olarak; Sosyal Güvenlik Kurumu ve yetkili diğer kamu kurum ve kuruluşlarına, ödemelerin yapılması için bankalara, sahaya giriş gerektiği ölçüde hizmet verilen müşteri firmalara ve Şirket\'in hukuk ve mali müşavirlik hizmeti aldığı kişilere aktarılabilecektir.'],
  ['p', 'Formda paylaştığınız bilgi ve belgeler, sunucuları yurt dışında bulunan bulut depolama hizmeti (Google) üzerinde saklanmaktadır. Bu nedenle verileriniz KVKK\'nın 9. maddesi kapsamında yurt dışına aktarılmaktadır.'],
  ['h', '6. SAKLAMA SÜRESİ'],
  ['p', 'Kişisel verileriniz, iş ilişkisi süresince ve iş ilişkisinin sona ermesinden itibaren ilgili mevzuatta öngörülen saklama ve zamanaşımı süreleri boyunca saklanır; sürenin dolmasıyla silinir, yok edilir veya anonim hale getirilir.'],
  ['h', '7. KVKK\'NIN 11. MADDESİ KAPSAMINDAKİ HAKLARINIZ'],
  ['p', 'Kişisel verilerinizin işlenip işlenmediğini öğrenme, işlenmişse buna ilişkin bilgi talep etme, işlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme, yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme, eksik veya yanlış işlenmişse düzeltilmesini isteme, KVKK\'nın 7. maddesindeki şartlar çerçevesinde silinmesini veya yok edilmesini isteme, bu işlemlerin aktarıldığı üçüncü kişilere bildirilmesini isteme, münhasıran otomatik sistemlerle analiz edilmesi suretiyle aleyhinize bir sonucun ortaya çıkmasına itiraz etme ve kanuna aykırı işleme sebebiyle zarara uğramanız halinde zararın giderilmesini talep etme haklarına sahipsiniz.'],
  ['p', `Bu haklarınıza ilişkin taleplerinizi ${EMAIL} adresine e-posta ile veya ${ADDRESS} adresine yazılı olarak iletebilirsiniz.`],
  ['h', 'AÇIK RIZA BEYANI'],
  ['p', 'Yukarıdaki aydınlatma metnini okuduğumu ve anladığımı; adli sicil kaydım dahil kişisel verilerimin belirtilen amaçlarla işlenmesine ve yurt dışında bulunan bulut depolama hizmetine aktarılarak saklanmasına özgür irademle açık rıza verdiğimi beyan ederim.'],
];

const A4 = [595.28, 841.89];
const MARGIN = 56;
const RESERVED_BOTTOM = 190; // left empty on the last page for the signature block

const pdf = await PDFDocument.create();
pdf.registerFontkit(fontkit);
const regular = await pdf.embedFont(fs.readFileSync(path.join(root, 'lib', 'fonts', 'DejaVuSans.ttf')), { subset: true });
const bold = await pdf.embedFont(fs.readFileSync(path.join(root, 'lib', 'fonts', 'DejaVuSans-Bold.ttf')), { subset: true });
pdf.setTitle('KVKK Aydınlatma Metni ve Açık Rıza Beyanı');
pdf.setAuthor(COMPANY);

const width = A4[0] - MARGIN * 2;
let page = pdf.addPage(A4);
let y = A4[1] - MARGIN;

const wrap = (text, font, size, maxWidth) => {
  const lines = [];
  let line = '';
  for (const word of text.split(/\s+/)) {
    const candidate = line ? `${line} ${word}` : word;
    if (font.widthOfTextAtSize(candidate, size) > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = candidate;
    }
  }
  if (line) lines.push(line);
  return lines;
};

const write = (text, { font = regular, size = 9.5, indent = 0, gapAfter = 6, bullet = false } = {}) => {
  const lineHeight = size * 1.45;
  for (const [i, line] of wrap(text, font, size, width - indent).entries()) {
    if (y - lineHeight < MARGIN) {
      page = pdf.addPage(A4);
      y = A4[1] - MARGIN;
    }
    y -= lineHeight;
    if (bullet && i === 0) page.drawText('•', { x: MARGIN + indent - 10, y, size, font, color: rgb(0.15, 0.25, 0.6) });
    page.drawText(line, { x: MARGIN + indent, y, size, font, color: rgb(0.1, 0.1, 0.12) });
  }
  y -= gapAfter;
};

for (const [kind, text] of content) {
  if (kind === 'title') write(text, { font: bold, size: 12.5, gapAfter: 14 });
  else if (kind === 'h') write(text, { font: bold, size: 10.5, gapAfter: 4 });
  else if (kind === 'li') write(text, { indent: 14, gapAfter: 2, bullet: true });
  else write(text);
}

if (y - RESERVED_BOTTOM < MARGIN) pdf.addPage(A4);

fs.writeFileSync(out, await pdf.save());
console.log('Yazıldı:', out, 'sayfa:', pdf.getPageCount());
