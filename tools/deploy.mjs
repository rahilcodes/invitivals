import Client from 'file:///C:/Users/moham/.gemini/antigravity/brain/5eab0fb7-5e42-4aed-878d-a3820f01b0d6/scratch/node_modules/ssh2/lib/client.js';
import fs from 'fs';
import path from 'path';

const conn = new Client();

const config = {
  host: '195.35.44.109',
  port: 65002,
  username: 'u702871438',
  password: 'ABCDe@54321',
};

const localDistDir = 'c:\\Users\\moham\\OneDrive\\Desktop\\Websites\\wishes\\dist';
const remoteTargetDir = 'domains/invitivals.com/public_html';

console.log('Connecting to Hostinger SSH with new credentials...');

conn.on('ready', () => {
  console.log('SSH Connection Established!');

  conn.sftp(async (err, sftp) => {
    if (err) {
      console.error('SFTP init error:', err);
      conn.end();
      process.exit(1);
    }

    function ensureRemoteDir(remoteDir) {
      return new Promise((resolve) => {
        sftp.stat(remoteDir, (statErr, stats) => {
          if (statErr || !stats.isDirectory()) {
            sftp.mkdir(remoteDir, { mode: 0o755 }, (mkdirErr) => {
              sftp.chmod(remoteDir, 0o755, () => resolve());
            });
          } else {
            sftp.chmod(remoteDir, 0o755, () => resolve());
          }
        });
      });
    }

    function uploadFile(localPath, remotePath) {
      return new Promise((resolve, reject) => {
        sftp.fastPut(localPath, remotePath, (putErr) => {
          if (putErr) {
            console.error(`Failed to upload ${remotePath}:`, putErr);
            reject(putErr);
          } else {
            sftp.chmod(remotePath, 0o644, () => {
              console.log(`Uploaded: ${remotePath}`);
              resolve();
            });
          }
        });
      });
    }

    async function uploadDirectory(localDir, remoteDir) {
      await ensureRemoteDir(remoteDir);
      const items = fs.readdirSync(localDir, { withFileTypes: true });

      for (const item of items) {
        const fullLocalPath = path.join(localDir, item.name);
        const fullRemotePath = `${remoteDir}/${item.name}`;

        if (item.isDirectory()) {
          await uploadDirectory(fullLocalPath, fullRemotePath);
        } else if (item.isFile()) {
          await uploadFile(fullLocalPath, fullRemotePath);
        }
      }
    }

    try {
      console.log(`Uploading built dist files to ${remoteTargetDir}...`);
      await uploadDirectory(localDistDir, remoteTargetDir);
      console.log('🎉 DEPLOYMENT SUCCESSFUL!');
      conn.end();
      process.exit(0);
    } catch (e) {
      console.error('Deployment failed:', e);
      conn.end();
      process.exit(1);
    }
  });
}).on('error', (err) => {
  console.error('Connection error:', err);
  process.exit(1);
}).connect(config);
