async function deriveKey(password, saltB64) {
  const encoder = new TextEncoder();
  const passwordKey = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveKey']
  );
  const salt = Uint8Array.from(atob(saltB64), c => c.charCodeAt(0));
  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: 100000,
      hash: 'SHA-256'
    },
    passwordKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['decrypt']
  );
}

function decodeB64(b64) {
  return Uint8Array.from(atob(b64), c => c.charCodeAt(0));
}

async function unlockCard(card, password) {
  const key = await deriveKey(password, card.dataset.salt);
  const iv = decodeB64(card.dataset.iv);
  const encrypted = decodeB64(card.dataset.ciphertext);
  const plaintext = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    key,
    encrypted
  );
  const decoder = new TextDecoder();
  const html = decoder.decode(plaintext);
  const body = card.querySelector('.reveal-body');
  body.innerHTML = html;
  card.classList.add('is-unlocked');
  const storageKey = `rippers-unlock-${card.dataset.lockId}`;
  localStorage.setItem(storageKey, password);
}

async function tryStoredUnlock(card) {
  const storageKey = `rippers-unlock-${card.dataset.lockId}`;
  const saved = localStorage.getItem(storageKey);
  if (!saved) return;
  try { await unlockCard(card, saved); } catch {}
}

window.addEventListener('DOMContentLoaded', () => {
  const cards = document.querySelectorAll('[data-lock-id]');
  cards.forEach(card => {
    tryStoredUnlock(card);
    const form = card.querySelector('.reveal-form');
    if (!form) return;
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const input = form.querySelector('input');
      const status = form.querySelector('.reveal-status');
      const password = input.value.trim();
      if (!password) {
        status.textContent = 'Enter a code word.';
        return;
      }
      status.textContent = 'Unlocking…';
      try {
        await unlockCard(card, password);
        status.textContent = 'Unlocked.';
      } catch {
        status.textContent = 'That code word did not open this item.';
      }
    });
  });
});
