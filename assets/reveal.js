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
    { name: 'PBKDF2', salt, iterations, hash: 'SHA-256' },
    passwordKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['decrypt']
  );
}

function decodeRevealB64(value) {
  return Uint8Array.from(atob(value), c => c.charCodeAt(0));
}

function normalizeCaseMemory(nodes, type) {
  const field = type === 'people' ? 'casePerson' : 'caseLocation';
  const noteField = type === 'people' ? 'casePersonNote' : 'caseLocationNote';
  const seen = new Set();
  return Array.from(nodes).map(node => ({
    name: (node.dataset[field] || '').trim(),
    note: (node.dataset[noteField] || '').trim()
  })).filter(item => {
    if (!item.name) return false;
    const key = item.name.toLocaleLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function rememberCaseMemory(lockId, body) {
  if (!lockId || !body) return;
  const people = normalizeCaseMemory(body.querySelectorAll('[data-case-person]'), 'people');
  const locations = normalizeCaseMemory(body.querySelectorAll('[data-case-location]'), 'locations');
  const key = `rippers-unlock-memory-${lockId}`;
  if (!people.length && !locations.length) {
    localStorage.removeItem(key);
    return;
  }
  localStorage.setItem(key, JSON.stringify({ people, locations }));
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
    const revealedHeading = body?.querySelector('h2');
    const summaryTitle = documentRecord.querySelector('.document-summary-copy strong');
    if (revealedHeading && summaryTitle) summaryTitle.textContent = revealedHeading.textContent.trim();
  }
}

async function unlockReveal(card, password) {
  const iterations = Number(card.dataset.iterations || 100000);
  const key = await deriveRevealKey(password, card.dataset.salt, iterations);
  const iv = decodeRevealB64(card.dataset.iv);
  const encrypted = decodeRevealB64(card.dataset.ciphertext);
  const plaintext = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, encrypted);
  const body = card.querySelector('.reveal-body');
  if (!body) throw new Error('Reveal body missing');

  body.innerHTML = new TextDecoder().decode(plaintext);
  setRevealOpenState(card);

  const lockId = card.dataset.lockId;
  const revealedTitle = body.querySelector('h2')?.textContent?.trim() || '';
  localStorage.setItem(`rippers-unlock-${lockId}`, password);
  if (revealedTitle) localStorage.setItem(`rippers-unlock-title-${lockId}`, revealedTitle);
  if (!localStorage.getItem(`rippers-unlock-time-${lockId}`)) {
    localStorage.setItem(`rippers-unlock-time-${lockId}`, String(Date.now()));
  }
  rememberCaseMemory(lockId, body);
  window.dispatchEvent(new CustomEvent('rippers:document-unlocked', {
    detail: { lockId, title: revealedTitle }
  }));
}

async function tryStoredReveal(card) {
  const lockId = card.dataset.lockId;
  const saved = localStorage.getItem(`rippers-unlock-${lockId}`);
  if (!saved) return;
  try {
    await unlockReveal(card, saved);
  } catch {
    localStorage.removeItem(`rippers-unlock-${lockId}`);
    localStorage.removeItem(`rippers-unlock-title-${lockId}`);
    localStorage.removeItem(`rippers-unlock-time-${lockId}`);
    localStorage.removeItem(`rippers-unlock-memory-${lockId}`);
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
  if (!target || target.hidden) return;
  const record = target.matches?.('[data-document-record],[data-release-record]')
    ? target
    : target.closest?.('[data-document-record],[data-release-record]');
  if (record?.tagName === 'DETAILS') record.open = true;
  window.requestAnimationFrame(() => {
    target.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'start' });
  });
}

window.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-lock-id][data-ciphertext]').forEach(card => {
    tryStoredReveal(card);
    const form = card.querySelector('.reveal-form');
    form?.addEventListener('submit', async event => {
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
