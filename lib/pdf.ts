// Stamps the employee's details and drawn signature onto the contract and KVKK PDFs.
import fs from 'fs';
import path from 'path';
import { PDFDocument, PDFFont, PDFPage, rgb } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';

const read = (...parts: string[]) => fs.readFileSync(path.join(process.cwd(), ...parts));

export const CONTRACT_PDF = () => read('public', 'belgeler', 'proje-bazli-is-sozlesmesi.pdf');
export const KVKK_PDF = () => read('public', 'belgeler', 'kvkk-aydinlatma-metni.pdf');

export type SignatureInfo = {
  title: string;
  rows: [string, string][];
  signaturePng: Buffer;
  signedAt: string;
};

const BLUE = rgb(0.15, 0.25, 0.6);
const INK = rgb(0.1, 0.1, 0.12);
const MUTED = rgb(0.4, 0.42, 0.48);

function drawBlock(page: PDFPage, info: SignatureInfo, fonts: { regular: PDFFont; bold: PDFFont }, top: number) {
  const left = 56;
  const width = page.getWidth() - left * 2;
  const height = 250;
  const bottom = top - height;

  page.drawRectangle({ x: left, y: bottom, width, height, borderColor: BLUE, borderWidth: 1, color: rgb(0.97, 0.98, 1) });
  page.drawText(info.title, { x: left + 14, y: top - 22, size: 10.5, font: fonts.bold, color: BLUE });

  // Signature box on the right; the rows on the left must not run into it.
  const boxWidth = 190;
  const boxHeight = 95;
  const boxX = left + width - boxWidth - 14;
  const valueX = left + 130;
  const maxValueWidth = boxX - valueX - 10;
  const wrap = (text: string) => {
    const lines: string[] = [];
    let line = '';
    for (const word of text.split(/\s+/)) {
      const candidate = line ? `${line} ${word}` : word;
      if (line && fonts.regular.widthOfTextAtSize(candidate, 9) > maxValueWidth) {
        lines.push(line);
        line = word;
      } else {
        line = candidate;
      }
    }
    return [...lines, line];
  };

  let y = top - 44;
  for (const [label, value] of info.rows) {
    page.drawText(`${label}:`, { x: left + 14, y, size: 9, font: fonts.bold, color: INK });
    wrap(value).forEach((line, i) => {
      page.drawText(line, { x: valueX, y: y - i * 11, size: 9, font: fonts.regular, color: INK });
    });
    y -= 16 + (wrap(value).length - 1) * 11;
  }

  const boxY = bottom + 30;
  page.drawText('İmza', { x: boxX, y: boxY + boxHeight + 6, size: 9, font: fonts.bold, color: INK });
  page.drawRectangle({ x: boxX, y: boxY, width: boxWidth, height: boxHeight, borderColor: MUTED, borderWidth: 0.6, color: rgb(1, 1, 1) });
  return { boxX, boxY, boxWidth, boxHeight, left, bottom };
}

async function stamp(source: Buffer, pageIndex: number | 'last', top: number, info: SignatureInfo): Promise<Uint8Array> {
  const pdf = await PDFDocument.load(source);
  pdf.registerFontkit(fontkit);
  const regular = await pdf.embedFont(read('lib', 'fonts', 'DejaVuSans.ttf'), { subset: true });
  const bold = await pdf.embedFont(read('lib', 'fonts', 'DejaVuSans-Bold.ttf'), { subset: true });
  const page = pdf.getPage(pageIndex === 'last' ? pdf.getPageCount() - 1 : pageIndex);

  const { boxX, boxY, boxWidth, boxHeight, left, bottom } = drawBlock(page, info, { regular, bold }, top);

  const signature = await pdf.embedPng(info.signaturePng);
  const scale = Math.min((boxWidth - 10) / signature.width, (boxHeight - 10) / signature.height);
  const w = signature.width * scale;
  const h = signature.height * scale;
  page.drawImage(signature, { x: boxX + (boxWidth - w) / 2, y: boxY + (boxHeight - h) / 2, width: w, height: h });

  page.drawText(
    `Bu belge ${info.signedAt} tarihinde elektronik form üzerinden onaylanmış ve imzalanmıştır.`,
    { x: left + 14, y: bottom + 12, size: 7.5, font: regular, color: MUTED }
  );
  return pdf.save();
}

/** Contract: page 2 has its lower half empty; the block goes there. */
export const signContract = (info: SignatureInfo) => stamp(CONTRACT_PDF(), 1, 330, info);

/** KVKK: the generator leaves the bottom of the last page empty. */
export const signKvkk = (info: SignatureInfo) => stamp(KVKK_PDF(), 'last', 330, info);
