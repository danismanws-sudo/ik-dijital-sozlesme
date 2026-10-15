// One-time helper: signs in to the company Google account and stores the
// resulting refresh token in .env.local as GOOGLE_REFRESH_TOKEN.
//
// 1. Put GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET into .env.local
// 2. node scripts/google-auth.mjs
// 3. Sign in with the company account in the browser window that opens
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { exec } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const envPath = path.join(root, '.env.local');
const SCOPES = [
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/spreadsheets',
  'https://www.googleapis.com/auth/gmail.send',
];

const env = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8') : '';
const read = (key) => (env.match(new RegExp(`^${key}=(.*)$`, 'm')) || [])[1]?.trim();
const clientId = read('GOOGLE_CLIENT_ID');
const clientSecret = read('GOOGLE_CLIENT_SECRET');
if (!clientId || !clientSecret) {
  console.error('.env.local içinde GOOGLE_CLIENT_ID ve GOOGLE_CLIENT_SECRET bulunamadı.');
  process.exit(1);
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://127.0.0.1');
  const code = url.searchParams.get('code');
  if (!code) {
    res.end(url.searchParams.get('error') || 'Kod bulunamadı');
    return;
  }
  const redirectUri = `http://127.0.0.1:${server.address().port}`;
  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    }),
  });
  const tokens = await tokenRes.json();
  if (!tokens.refresh_token) {
    res.end('Hata: refresh token alınamadı. Terminale bakın.');
    console.error(tokens);
    server.close();
    return;
  }
  const line = `GOOGLE_REFRESH_TOKEN=${tokens.refresh_token}`;
  const updated = /^GOOGLE_REFRESH_TOKEN=.*$/m.test(env)
    ? env.replace(/^GOOGLE_REFRESH_TOKEN=.*$/m, line)
    : `${env.trimEnd()}\n${line}\n`;
  fs.writeFileSync(envPath, updated);
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.end('<h2>Tamam! Bu pencereyi kapatabilirsiniz.</h2>');
  console.log('Refresh token .env.local dosyasına yazıldı.');
  server.close();
});

server.listen(0, '127.0.0.1', () => {
  const redirectUri = `http://127.0.0.1:${server.address().port}`;
  const authUrl =
    'https://accounts.google.com/o/oauth2/v2/auth?' +
    new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: SCOPES.join(' '),
      access_type: 'offline',
      prompt: 'consent',
    });
  console.log('Tarayıcıda Google girişi açılıyor. Açılmazsa bu adresi kopyalayın:\n' + authUrl);
  exec(`start "" "${authUrl}"`);
});
