import crypto from 'node:crypto';
import process from 'node:process';

const [lockId] = process.argv.slice(2);
const codeword = process.env.RIPPERS_CODEWORD;

if (!lockId || !codeword) {
  console.error('Usage: RIPPERS_CODEWORD=WORD node tools/encrypt-document.mjs <lock-id> < plaintext.html');
  process.exit(1);
}

const chunks = [];
for await (const chunk of process.stdin) chunks.push(chunk);
const plaintext = Buffer.concat(chunks).toString('utf8');
if (!plaintext.trim()) {
  console.error('No plaintext received on stdin.');
  process.exit(1);
}

const iterations = 100000;
const salt = crypto.randomBytes(16);
const iv = crypto.randomBytes(12);
const normalizedCodeword = codeword.trim().toUpperCase();
const key = crypto.pbkdf2Sync(normalizedCodeword, salt, iterations, 32, 'sha256');
const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
const tag = cipher.getAuthTag();
const webCryptoCiphertext = Buffer.concat([encrypted, tag]);

console.log(`lock:\n  id: ${JSON.stringify(lockId)}\n  iterations: ${iterations}\n  salt: ${JSON.stringify(salt.toString('base64'))}\n  iv: ${JSON.stringify(iv.toString('base64'))}\n  ciphertext: ${JSON.stringify(webCryptoCiphertext.toString('base64'))}`);
