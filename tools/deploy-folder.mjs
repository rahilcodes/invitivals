/* Upload one built folder of dist/ to the server, nothing else.
 *
 *   node tools/deploy-folder.mjs <folder>      e.g. saicharan-lakshmi-engagement
 *
 * Same .env.deploy as tools/deploy.mjs. Every file in the folder is sent; nothing is deleted.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ssh2 from 'ssh2';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const folder = process.argv[2];
if (!folder || !fs.existsSync(path.join(ROOT, 'dist', folder))) { console.error('usage: node tools/deploy-folder.mjs <folder under dist/>'); process.exit(1); }
for (const line of fs.readFileSync(path.join(ROOT, '.env.deploy'), 'utf8').split(/\r?\n/)) {
  const m = line.match(/^\s*([A-Z_]+)\s*=\s*(.*?)\s*$/);
  if (m && !(m[1] in process.env)) process.env[m[1]] = m[2].replace(/^(['"])(.*)\1$/, '$2');
}
const { DEPLOY_HOST, DEPLOY_PORT = '22', DEPLOY_USER, DEPLOY_DIR, DEPLOY_KEY, DEPLOY_PASSWORD } = process.env;
const privateKey = DEPLOY_KEY && fs.existsSync(DEPLOY_KEY) ? fs.readFileSync(DEPLOY_KEY, 'utf8') : undefined;

const conn = new ssh2.Client();
conn.on('ready', () => conn.sftp(async (err, sftp) => {
  if (err) throw err;
  const stat = (p) => new Promise((r) => sftp.stat(p, (e, s) => r(e ? null : s)));
  const mkdir = (p) => new Promise((r) => sftp.mkdir(p, { mode: 0o755 }, () => r()));
  const put = (l, p) => new Promise((ok, no) => sftp.fastPut(l, p, { mode: 0o644 }, (e) => (e ? no(e) : ok())));
  let sent = 0;
  const upload = async (localDir, remoteDir) => {
    if (!(await stat(remoteDir))) await mkdir(remoteDir);
    for (const item of fs.readdirSync(localDir, { withFileTypes: true })) {
      const local = path.join(localDir, item.name), remote = `${remoteDir}/${item.name}`;
      if (item.isDirectory()) await upload(local, remote);
      else if (item.isFile()) { await put(local, remote); sent++; console.log('uploaded', remote.slice(DEPLOY_DIR.length)); }
    }
  };
  try { await upload(path.join(ROOT, 'dist', folder), `${DEPLOY_DIR}/${folder}`); console.log(`\n${sent} files uploaded`); }
  catch (e) { console.error('Upload failed:', e.message); process.exitCode = 1; }
  conn.end();
})).on('error', (e) => { console.error('Connection error:', e.message); process.exit(1); })
  .connect({ host: DEPLOY_HOST, port: Number(DEPLOY_PORT), username: DEPLOY_USER, privateKey, password: privateKey ? undefined : DEPLOY_PASSWORD, readyTimeout: 30000 });
