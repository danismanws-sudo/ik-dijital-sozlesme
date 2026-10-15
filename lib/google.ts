// Minimal Google Drive / Sheets / Gmail client used by the submit API.
// Authenticates as the company Google account with an OAuth refresh token
// (see scripts/google-auth.mjs and .env.example).

const TOKEN_URL = 'https://oauth2.googleapis.com/token';
const DRIVE = 'https://www.googleapis.com/drive/v3';
const DRIVE_UPLOAD = 'https://www.googleapis.com/upload/drive/v3';
const SHEETS = 'https://sheets.googleapis.com/v4/spreadsheets';
const GMAIL = 'https://gmail.googleapis.com/gmail/v1/users/me';

export const FOLDER_MIME = 'application/vnd.google-apps.folder';
export const SHEET_MIME = 'application/vnd.google-apps.spreadsheet';
const XLSX_MIME = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

export type DriveFile = { id: string; name: string; webViewLink?: string };

export const isGoogleConfigured = () =>
  !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET && process.env.GOOGLE_REFRESH_TOKEN);

let cachedToken: { value: string; expiresAt: number } | null = null;

async function accessToken(): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) return cachedToken.value;
  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN!,
      grant_type: 'refresh_token',
    }),
  });
  if (!res.ok) throw new Error(`Google oturumu açılamadı (${res.status}): ${await res.text()}`);
  const json = await res.json();
  cachedToken = { value: json.access_token, expiresAt: Date.now() + json.expires_in * 1000 };
  return cachedToken.value;
}

async function google(url: string, init: RequestInit = {}): Promise<Response> {
  const res = await fetch(url, {
    ...init,
    headers: { Authorization: `Bearer ${await accessToken()}`, ...(init.headers || {}) },
  });
  if (!res.ok) throw new Error(`Google API hatası ${res.status} ${url.split('?')[0]}: ${await res.text()}`);
  return res;
}

const googleJson = async (url: string, init: RequestInit = {}) => (await google(url, init)).json();

const escapeQuery = (value: string) => value.replace(/\\/g, '\\\\').replace(/'/g, "\\'");

// ---------------------------------------------------------------- Drive

/** Finds a file this app created, tagged with the given appProperties key/value. */
export async function findByTag(key: string, value: string, parentId?: string): Promise<DriveFile | null> {
  let q = `appProperties has { key='${escapeQuery(key)}' and value='${escapeQuery(value)}' } and trashed = false`;
  if (parentId) q += ` and '${escapeQuery(parentId)}' in parents`;
  const json = await googleJson(
    `${DRIVE}/files?${new URLSearchParams({ q, fields: 'files(id,name,webViewLink)', pageSize: '1', spaces: 'drive' })}`
  );
  return json.files?.[0] || null;
}

export async function createFile(meta: {
  name: string;
  mimeType: string;
  parentId?: string;
  appProperties?: Record<string, string>;
}): Promise<DriveFile> {
  return googleJson(`${DRIVE}/files?fields=id,name,webViewLink`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: meta.name,
      mimeType: meta.mimeType,
      parents: meta.parentId ? [meta.parentId] : undefined,
      appProperties: meta.appProperties,
    }),
  });
}

/** Returns the folder tagged ikFolder=<key>, creating it (under parentId) when missing. */
export async function ensureFolder(key: string, name: string, parentId?: string): Promise<DriveFile> {
  return (
    (await findByTag('ikFolder', key)) ||
    createFile({ name, mimeType: FOLDER_MIME, parentId, appProperties: { ikFolder: key } })
  );
}

export async function uploadFile(
  name: string,
  mimeType: string,
  data: Uint8Array | Buffer,
  parentId: string
): Promise<DriveFile> {
  const boundary = `ik-${Math.random().toString(36).slice(2)}`;
  const body = Buffer.concat([
    Buffer.from(
      `--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n` +
        JSON.stringify({ name, parents: [parentId] }) +
        `\r\n--${boundary}\r\nContent-Type: ${mimeType}\r\n\r\n`
    ),
    Buffer.from(data),
    Buffer.from(`\r\n--${boundary}--`),
  ]);
  return googleJson(`${DRIVE_UPLOAD}/files?uploadType=multipart&fields=id,name,webViewLink`, {
    method: 'POST',
    headers: { 'Content-Type': `multipart/related; boundary=${boundary}` },
    body,
  });
}

export async function exportXlsx(fileId: string): Promise<Buffer> {
  const res = await google(`${DRIVE}/files/${fileId}/export?mimeType=${encodeURIComponent(XLSX_MIME)}`);
  return Buffer.from(await res.arrayBuffer());
}

// ---------------------------------------------------------------- Sheets

export async function getColumn(spreadsheetId: string, column: string): Promise<string[]> {
  const json = await googleJson(`${SHEETS}/${spreadsheetId}/values/${encodeURIComponent(`${column}:${column}`)}`);
  return (json.values || []).map((row: string[]) => row[0] ?? '');
}

/** Values are written RAW so TC / phone / IBAN stay text and are not turned into numbers. */
export async function appendRow(spreadsheetId: string, row: string[]): Promise<void> {
  await google(
    `${SHEETS}/${spreadsheetId}/values/${encodeURIComponent('A1')}:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`,
    { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ values: [row] }) }
  );
}

/** Writes the header row, makes it bold and frozen. */
export async function writeHeader(spreadsheetId: string, header: string[]): Promise<void> {
  await google(`${SHEETS}/${spreadsheetId}/values/${encodeURIComponent('A1')}?valueInputOption=RAW`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ values: [header] }),
  });
  await google(`${SHEETS}/${spreadsheetId}:batchUpdate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      requests: [
        {
          repeatCell: {
            range: { sheetId: 0, startRowIndex: 0, endRowIndex: 1 },
            cell: { userEnteredFormat: { textFormat: { bold: true }, backgroundColor: { red: 0.9, green: 0.92, blue: 0.98 } } },
            fields: 'userEnteredFormat(textFormat,backgroundColor)',
          },
        },
        { updateSheetProperties: { properties: { sheetId: 0, gridProperties: { frozenRowCount: 1 } }, fields: 'gridProperties.frozenRowCount' } },
      ],
    }),
  });
}

// ---------------------------------------------------------------- Gmail

const encodeHeader = (value: string) => `=?UTF-8?B?${Buffer.from(value, 'utf8').toString('base64')}?=`;
const chunk76 = (b64: string) => b64.replace(/.{1,76}/g, '$&\r\n');

export async function sendMail(mail: {
  to: string[];
  subject: string;
  html: string;
  fromName?: string;
  attachments?: { filename: string; mimeType: string; data: Buffer }[];
}): Promise<void> {
  const boundary = `ik-mail-${Math.random().toString(36).slice(2)}`;
  const parts = [
    `--${boundary}\r\nContent-Type: text/html; charset=UTF-8\r\nContent-Transfer-Encoding: base64\r\n\r\n` +
      chunk76(Buffer.from(mail.html, 'utf8').toString('base64')),
    ...(mail.attachments || []).map(
      (a) =>
        `--${boundary}\r\nContent-Type: ${a.mimeType}; name="${encodeHeader(a.filename)}"\r\n` +
        `Content-Disposition: attachment; filename="${encodeHeader(a.filename)}"\r\n` +
        `Content-Transfer-Encoding: base64\r\n\r\n` +
        chunk76(a.data.toString('base64'))
    ),
  ];
  // Gmail fills in the sender address itself; it is only needed here to show a display name.
  const from = mail.fromName ? process.env.GOOGLE_ACCOUNT_EMAIL : null;
  const message =
    (from ? `From: ${encodeHeader(mail.fromName!)} <${from}>\r\n` : '') +
    `To: ${mail.to.join(', ')}\r\n` +
    `Subject: ${encodeHeader(mail.subject)}\r\n` +
    `MIME-Version: 1.0\r\n` +
    `Content-Type: multipart/mixed; boundary="${boundary}"\r\n\r\n` +
    parts.join('\r\n') +
    `\r\n--${boundary}--`;
  await google(`${GMAIL}/messages/send`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ raw: Buffer.from(message, 'utf8').toString('base64url') }),
  });
}
