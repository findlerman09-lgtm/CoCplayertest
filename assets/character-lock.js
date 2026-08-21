function decodeBase64(value) {
  return Uint8Array.from(atob(value), c => c.charCodeAt(0));
}

function encodeBase64(bytes) {
  let binary = '';
  bytes.forEach(byte => binary += String.fromCharCode(byte));
  return btoa(binary);
}

async function deriveVerifier(password, saltB64, iterations) {
  const encoder = new TextEncoder();
  const baseKey = await crypto.subtle.importKey(
    'raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits']
  );
  const bits = await crypto.subtle.deriveBits({
    name: 'PBKDF2',
    salt: decodeBase64(saltB64),
    iterations,
    hash: 'SHA-256'
  }, baseKey, 256);
  return encodeBase64(new Uint8Array(bits));
}

window.addEventListener('DOMContentLoaded', () => {
  const gate = document.querySelector('[data-character-gate]');
  if (!gate) return;

  const protectedShell = document.querySelector('[data-protected-character]');
  const slug = gate.dataset.characterGate;
  const verifier = gate.dataset.verifier;
  const salt = gate.dataset.salt;
  const iterations = Number(gate.dataset.iterations || 120000);
  const storageKey = `rippers-dossier-access:${slug}`;
  const form = gate.querySelector('form');
  const input = gate.querySelector('input');
  const status = gate.querySelector('[data-lock-status]');

  function unlock() {
    gate.hidden = true;
    protectedShell.hidden = false;
    document.body.classList.remove('is-locked');
    window.dispatchEvent(new CustomEvent('rippers:dossier-unlocked', { detail: { slug } }));
  }

  if (localStorage.getItem(storageKey) === verifier) {
    unlock();
    return;
  }

  form.addEventListener('submit', async event => {
    event.preventDefault();
    const password = input.value;
    if (!password) {
      status.textContent = 'Enter your dossier password.';
      return;
    }

    status.textContent = 'Checking dossier key…';
    form.classList.add('is-working');
    try {
      const candidate = await deriveVerifier(password, salt, iterations);
      if (candidate === verifier) {
        localStorage.setItem(storageKey, verifier);
        status.textContent = 'Dossier unlocked.';
        unlock();
      } else {
        status.textContent = 'That password does not open this dossier.';
        input.select();
      }
    } catch (error) {
      status.textContent = 'This browser could not verify the dossier password.';
    } finally {
      form.classList.remove('is-working');
    }
  });
});
