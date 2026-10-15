// Prepares the uploaded documents for the submit API. Phone photos are shrunk
// in the browser because the whole request must stay under Vercel's 4.5 MB limit.

const MAX_SIDE = 1600;
const JPEG_QUALITY = 0.8;
const MAX_PDF_BYTES = 2.5 * 1024 * 1024;

export type EncodedFile = { name: string; type: string; data: string };

const toBase64 = (blob: Blob) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(',')[1]);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });

async function shrinkImage(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file).catch(() => {
    throw new Error(`"${file.name}" açılamadı. Lütfen JPG veya PNG formatında bir fotoğraf seçin.`);
  });
  const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext('2d')!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  return new Promise((resolve) => canvas.toBlob((blob) => resolve(blob!), 'image/jpeg', JPEG_QUALITY));
}

export async function encodeUpload(files: FileList | undefined, label: string): Promise<EncodedFile> {
  const file = files?.[0];
  if (!file) throw new Error(`${label} seçilmedi.`);
  if (file.type === 'application/pdf') {
    if (file.size > MAX_PDF_BYTES) throw new Error(`${label} PDF dosyası çok büyük (en fazla 2,5 MB).`);
    return { name: file.name, type: file.type, data: await toBase64(file) };
  }
  if (!file.type.startsWith('image/')) throw new Error(`${label} yalnızca fotoğraf veya PDF olabilir.`);
  return { name: file.name, type: 'image/jpeg', data: await toBase64(await shrinkImage(file)) };
}
