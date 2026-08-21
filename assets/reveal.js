async function deriveRevealKey(password, saltB64, iterations = 100000) {
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
      iterations,
      hash: 'SHA-256'
    },
    passwordKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['decrypt']
  );
}

function decodeRevealB64(b64) {
  return Uint8Array.from(atob(b64), c => c.charCodeAt(0));
}

function setRevealOpenState(card) {
  card.classList.add('is-unlocked');
  card.querySelectorAll('[data-reveal-locked]').forEach(el => { el.hidden = true; });
  const body = card.querySelector('.reveal-body');
  if (body) body.hidden = false;

  const record = card.closest('[data-document-record]');
  if (record) {
    record.classList.remove('is-sealed');
    record.classList.add('is-unlocked');
    const status = record.querySelector('[data-document-status]');
    if (status) {
      status.textContent = 'OPEN';
      status.classList.remove('sealed');
      status.classList.add('available');
    }
  }
}

async function unlockReveal(card, password) {
  const iterations = Number(card.dataset.iterations || 100000);
  const key = await deriveRevealKey(password, card.dataset.salt, iterations);
  const iv = decodeRevealB64(card.dataset.iv);
  const encrypted = decodeRevealB64(card.dataset.ciphertext);
  const plaintext = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    key,
    encrypted
  );
  const decoder = new TextDecoder();
  const html = decoder.decode(plaintext);
  const body = card.querySelector('.reveal-body');
  if (!body) throw new Error('Reveal body missing');
  body.innerHTML = html;
  setRevealOpenState(card);

  const storageKey = `rippers-unlock-${card.dataset.lockId}`;
  localStorage.setItem(storageKey, password);
  window.dispatchEvent(new CustomEvent('rippers:document-unlocked', {
    detail: { lockId: card.dataset.lockId }
  }));
}

async function tryStoredReveal(card) {
  const storageKey = `rippers-unlock-${card.dataset.lockId}`;
  const saved = localStorage.getItem(storageKey);
  if (!saved) return;
  try {
    await unlockReveal(card, saved);
  } catch {
    localStorage.removeItem(storageKey);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  const cards = document.querySelectorAll('[data-lock-id]');
  cards.forEach(card => {
    tryStoredReveal(card);
    const form = card.querySelector('.reveal-form');
    if (!form) return;

    form.addEventListener('submit', async event => {
      event.preventDefault();
      const input = form.querySelector('input');
      const status = form.querySelector('.reveal-status');
      const password = (input?.value || '').trim().toUpperCase();
      if (!password) {
        if (status) status.textContent = 'Enter a code word.';
        return;
      }

      if (status) status.textContent = 'Testing the seal…';
      form.classList.add('is-working');
      try {
        await unlockReveal(card, password);
        if (status) status.textContent = 'Opened.';
        if (input) input.value = '';
      } catch {
        if (status) status.textContent = 'That code word did not open this item.';
        input?.select();
      } finally {
        form.classList.remove('is-working');
      }
    });
  });
});
