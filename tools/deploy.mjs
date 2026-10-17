/* ─────────────────────────────────────────────────────────────────────────
   Upload dist/ to the server over SFTP.

     npm run deploy            build, check the live links, upload what changed
     node tools/deploy.mjs --all     upload every file, changed or not

   Connection details are read from .env.deploy (never committed) — copy
   .env.deploy.example and fill it in. Nothing on the server is ever deleted,
   so an address that was live stays live.
   ───────────────────────────────────────────────────────────────────────── */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import ssh2 from 'ssh2';

const ROOT = process.env.REPO_ROOT || path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = process.env.DEPLOY_SNAPSHOT || path.join(ROOT, 'dist');
const ALL = process.argv.includes('--all');

const envFile = path.join(ROOT, '.env.deploy');
if (fs.existsSync(envFile)) {
  for (const line of fs.readFileSync(envFile, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z_]+)\s*=\s*(.*?)\s*$/);
    if (m && !(m[1] in process.env)) process.env[m[1]] = m[2].replace(/^(['"])(.*)\1$/, '$2');
  }
}
const { DEPLOY_HOST, DEPLOY_PORT = '22', DEPLOY_USER, DEPLOY_DIR, DEPLOY_KEY, DEPLOY_PASSWORD } = process.env;
if (!DEPLOY_HOST || !DEPLOY_USER || !DEPLOY_DIR) {
  console.error('Missing DEPLOY_HOST, DEPLOY_USER or DEPLOY_DIR — copy .env.deploy.example to .env.deploy and fill it in.');
  process.exit(1);
}
const privateKey = DEPLOY_KEY && fs.existsSync(DEPLOY_KEY) ? fs.readFileSync(DEPLOY_KEY, 'utf8') : undefined;
if (!privateKey && !DEPLOY_PASSWORD) {
  console.error('No SSH key found at DEPLOY_KEY and no DEPLOY_PASSWORD set.');
  process.exit(1);
}

// never upload a build that would break a link someone already has
const check = spawnSync(process.execPath, [path.join(ROOT, 'tools/check-links.mjs')], { stdio: 'inherit' });
if (check.status !== 0) {
  console.error('\nNot deployed: fix the links above first.');
  process.exit(1);
}

const conn = new ssh2.Client();
conn
  .on('ready', () => {
    conn.sftp(async (err, sftp) => {
      if (err) throw err;
      const stat = (p) => new Promise((r) => sftp.stat(p, (e, s) => r(e ? null : s)));
      const mkdir = (p) => new Promise((r) => sftp.mkdir(p, { mode: 0o755 }, () => r()));
      const put = (l, p) => new Promise((ok, no) => sftp.fastPut(l, p, { mode: 0o644 }, (e) => (e ? no(e) : ok())));

      let sent = 0;
      let same = 0;
      const upload = async (localDir, remoteDir) => {
        const s = await stat(remoteDir);
        if (!s) await mkdir(remoteDir);
        for (const item of fs.readdirSync(localDir, { withFileTypes: true })) {
          const local = path.join(localDir, item.name);
          const remote = `${remoteDir}/${item.name}`;
          if (item.isDirectory()) await upload(local, remote);
          else if (item.isFile()) {
            const l = fs.statSync(local);
            const r = ALL ? null : await stat(remote);
            // pages are small and always sent; pictures and audio only when they differ
            const page = /\.(html|xml|txt|js|css|json|ics|htaccess)$/.test(item.name) || item.name === '.htaccess';
            if (r && !page && r.size === l.size && r.mtime * 1000 >= l.mtimeMs) {
              same++;
              continue;
            }
            await put(local, remote);
            sent++;
            console.log('uploaded', remote.slice(DEPLOY_DIR.length));
          }
        }
      };

      try {
        await upload(DIST, DEPLOY_DIR);
        console.log(`\nDeployed: ${sent} uploaded, ${same} unchanged.`);
        conn.end();
      } catch (e) {
        console.error('Deployment failed:', e.message);
        conn.end();
        process.exit(1);
      }
    });
  })
  .on('error', (e) => {
    console.error('Connection error:', e.message);
    process.exit(1);
  })
  .connect({
    host: DEPLOY_HOST,
    port: Number(DEPLOY_PORT),
    username: DEPLOY_USER,
    privateKey,
    password: DEPLOY_PASSWORD || undefined,
    readyTimeout: 60000,
    keepaliveInterval: 10000,
  });
