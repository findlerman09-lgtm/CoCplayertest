function rippersDecodeBase64(value) {
  return Uint8Array.from(atob(value), c => c.charCodeAt(0));
}

function rippersEncodeBase64(bytes) {
  let binary = '';
  bytes.forEach(byte => binary += String.fromCharCode(byte));
  return btoa(binary);
}

async function rippersDeriveVerifier(password, saltB64, iterations) {
  const encoder = new TextEncoder();
  const baseKey = await crypto.subtle.importKey(
    'raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits']
  );
  const bits = await crypto.subtle.deriveBits({
    name: 'PBKDF2',
    salt: rippersDecodeBase64(saltB64),
    iterations,
    hash: 'SHA-256'
  }, baseKey, 256);
  return rippersEncodeBase64(new Uint8Array(bits));
}

window.addEventListener('DOMContentLoaded', () => {
  const storageKey = 'rippers-archive-access';
  const guard = document.querySelector('[data-archive-guard]');

  if (guard) {
    const verifier = guard.dataset.archiveVerifier;
    const rootUrl = guard.dataset.archiveRoot || '/';
    if (localStorage.getItem(storageKey) !== verifier) {
      window.location.replace(rootUrl);
      return;
    }
    document.body.classList.remove('archive-guard-pending');
  }

  const gate = document.querySelector('[data-archive-gate]');
  if (!gate) return;

  const salt = gate.dataset.salt;
  const verifier = gate.dataset.verifier;
  const iterations = Number(gate.dataset.iterations || 120000);
  const target = gate.dataset.target;
  const form = gate.querySelector('[data-archive-key-form]');
  const input = gate.querySelector('input');
  const status = gate.querySelector('[data-archive-key-status]');
  const returnLink = gate.querySelector('[data-archive-return]');

  function showRememberedAccess() {
    if (form) form.hidden = true;
    if (returnLink) returnLink.hidden = false;
    if (status) status.textContent = '';
  }

  if (localStorage.getItem(storageKey) === verifier) {
    showRememberedAccess();
    return;
  }

  form?.addEventListener('submit', async event => {
    event.preventDefault();
    const key = (input?.value || '').trim().toUpperCase();
    if (!key) {
      status.textContent = 'A key is required.';
      return;
    }

    status.textContent = 'Checking…';
    form.classList.add('is-working');
    try {
      const candidate = await rippersDeriveVerifier(key, salt, iterations);
      if (candidate === verifier) {
        localStorage.setItem(storageKey, verifier);
        status.textContent = 'Accepted.';
        window.location.assign(target);
      } else {
        status.textContent = 'The archive remains closed.';
        input.select();
      }
    } catch {
      status.textContent = 'This browser could not verify the key.';
    } finally {
      form.classList.remove('is-working');
    }
  });
});
