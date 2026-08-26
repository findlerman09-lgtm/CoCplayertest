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
  const returnStorageKey = 'rippers-archive-return';
  const lastDossierKey = 'rippers-last-dossier';
  const guard = document.querySelector('[data-archive-guard]');

  function clearArchiveAccess() {
    localStorage.removeItem(storageKey);
    sessionStorage.removeItem(returnStorageKey);
  }

  function forgetDossierAccess() {
    Object.keys(localStorage)
      .filter(key => key.startsWith('rippers-dossier-access:'))
      .forEach(key => localStorage.removeItem(key));
    localStorage.removeItem(lastDossierKey);
  }

  document.querySelectorAll('[data-lock-archive]').forEach(button => {
    button.addEventListener('click', () => {
      if (!window.confirm('Lock the player archive on this device? Investigator tracker state will be retained.')) return;
      clearArchiveAccess();
      window.location.assign(button.dataset.archiveRoot || '/');
    });
  });

  document.querySelectorAll('[data-forget-device]').forEach(button => {
    button.addEventListener('click', () => {
      const confirmed = window.confirm('Forget archive and dossier access on this device? HP, SAN, Luck, improvement marks, and private effects will be retained.');
      if (!confirmed) return;
      clearArchiveAccess();
      forgetDossierAccess();
      window.location.assign(button.dataset.archiveRoot || '/');
    });
  });

  if (guard) {
    const verifier = guard.dataset.archiveVerifier;
    const rootUrl = guard.dataset.archiveRoot || '/';
    if (localStorage.getItem(storageKey) !== verifier) {
      const requested = `${window.location.pathname}${window.location.search}${window.location.hash}`;
      if (requested && requested !== rootUrl) sessionStorage.setItem(returnStorageKey, requested);
      if (window.location.pathname !== new URL(rootUrl, window.location.origin).pathname) {
        window.location.replace(rootUrl);
      } else {
        document.body.classList.remove('archive-guard-pending');
      }
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
  const siteRoot = gate.dataset.siteRoot || '/';
  const form = gate.querySelector('[data-archive-key-form]');
  const input = gate.querySelector('input');
  const submit = form?.querySelector('button[type="submit"]');
  const status = gate.querySelector('[data-archive-key-status]');
  const returnLink = gate.querySelector('[data-archive-return]');

  function setWorking(working) {
    form?.classList.toggle('is-working', working);
    if (input) input.disabled = working;
    if (submit) submit.disabled = working;
  }

  function announce(message, focus = false) {
    if (!status) return;
    status.textContent = message;
    if (focus) {
      status.setAttribute('tabindex', '-1');
      status.focus({ preventScroll: true });
    }
  }

  function safeReturnTarget() {
    const pending = sessionStorage.getItem(returnStorageKey);
    if (!pending) return target;

    try {
      const candidate = new URL(pending, window.location.origin);
      const allowedRoot = new URL(siteRoot, window.location.origin);
      if (candidate.origin !== window.location.origin) return target;
      if (!candidate.pathname.startsWith(allowedRoot.pathname)) return target;
      if (candidate.pathname === allowedRoot.pathname) return target;
      return `${candidate.pathname}${candidate.search}${candidate.hash}`;
    } catch {
      return target;
    }
  }

  function clearPendingReturn() {
    sessionStorage.removeItem(returnStorageKey);
  }

  function showRememberedAccess() {
    if (form) form.hidden = true;
    if (returnLink) {
      returnLink.href = safeReturnTarget();
      returnLink.hidden = false;
      returnLink.addEventListener('click', clearPendingReturn, { once: true });
    }
    announce('Archive access is remembered on this device.');
  }

  if (localStorage.getItem(storageKey) === verifier) {
    showRememberedAccess();
    return;
  }

  form?.addEventListener('submit', async event => {
    event.preventDefault();
    const key = (input?.value || '').trim().toUpperCase();
    if (!key) {
      announce('A key is required.', true);
      return;
    }

    announce('Checking…');
    setWorking(true);
    try {
      const candidate = await rippersDeriveVerifier(key, salt, iterations);
      if (candidate === verifier) {
        localStorage.setItem(storageKey, verifier);
        announce('Accepted.');
        const destination = safeReturnTarget();
        clearPendingReturn();
        window.location.assign(destination);
      } else {
        announce('The archive remains closed.', true);
        input?.select();
      }
    } catch {
      announce('This browser could not verify the key.', true);
    } finally {
      setWorking(false);
    }
  });
});
