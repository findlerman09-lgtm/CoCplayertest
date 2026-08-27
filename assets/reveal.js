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

  const documentRecord = card.closest('[data-document-record]');
  if (documentRecord) {
    documentRecord.classList.remove('is-sealed');
    documentRecord.classList.add('is-unlocked');
    const status = documentRecord.querySelector('[data-document-status]');
    if (status) {
      status.textContent = 'OPEN';
      status.classList.remove('sealed');
      status.classList.add('available');
    }
    const metaStatus = documentRecord.querySelector('[data-document-meta-status]');
    if (metaStatus) metaStatus.textContent = 'Open';

    // Sealed catalogue labels stay spoiler-safe before release. Once decrypted,
    // promote the actual handout heading into the record summary for easier reuse.
    const revealedHeading = body?.querySelector('h2');
    const summaryTitle = documentRecord.querySelector('.document-summary-copy strong');
    if (revealedHeading && summaryTitle) summaryTitle.textContent = revealedHeading.textContent.trim();
  }

  const releaseRecord = card.closest('[data-release-record]');
  if (releaseRecord) {
    releaseRecord.classList.remove('is-sealed');
    releaseRecord.classList.add('is-unlocked');
    const status = releaseRecord.querySelector('[data-release-status]');
    if (status) {
      status.textContent = 'OPEN';
      status.classList.remove('sealed');
      status.classList.add('available');
    }

    // Person/photo/location records may deliberately use an anonymous catalogue
    // title while sealed. The true heading exists only inside encrypted content.
    const revealedHeading = body?.querySelector('h2');
    const releaseTitle = releaseRecord.querySelector('[data-release-title]');
    if (revealedHeading && releaseTitle) releaseTitle.textContent = revealedHeading.textContent.trim();
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

  const lockId = card.dataset.lockId;
  const storageKey = `rippers-unlock-${lockId}`;
  const titleKey = `rippers-unlock-title-${lockId}`;
  const timeKey = `rippers-unlock-time-${lockId}`;
  const revealedTitle = body.querySelector('h2')?.textContent?.trim() || '';

  localStorage.setItem(storageKey, password);
  if (revealedTitle) localStorage.setItem(titleKey, revealedTitle);
  if (!localStorage.getItem(timeKey)) localStorage.setItem(timeKey, String(Date.now()));

  window.dispatchEvent(new CustomEvent('rippers:document-unlocked', {
    detail: { lockId, title: revealedTitle }
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
    localStorage.removeItem(`rippers-unlock-title-${card.dataset.lockId}`);
    localStorage.removeItem(`rippers-unlock-time-${card.dataset.lockId}`);
  }
}

function openRecordFromHash({ smooth = false } = {}) {
  if (!window.location.hash) return;

  let id;
  try {
    id = decodeURIComponent(window.location.hash.slice(1));
  } catch {
    id = window.location.hash.slice(1);
  }

  const target = document.getElementById(id);
  if (!target) return;

  const record = target.matches?.('[data-document-record],[data-release-record]')
    ? target
    : target.closest?.('[data-document-record],[data-release-record]');
  if (record?.tagName === 'DETAILS') record.open = true;

  window.requestAnimationFrame(() => {
    target.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'start' });
  });
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

  openRecordFromHash();
});

window.addEventListener('hashchange', () => openRecordFromHash({ smooth: true }));
