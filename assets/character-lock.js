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
  const lastDossierKey = 'rippers-last-dossier';
  const form = gate.querySelector('form');
  const input = gate.querySelector('input');
  const submit = form?.querySelector('button[type="submit"]');
  const status = gate.querySelector('[data-lock-status]');

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

  /* A PENDING verifier is a controlled publication hold, not a password.
     It keeps prepared dossier routes closed until a campaign-issued password
     has been registered through the normal verifier workflow. */
  if (verifier === 'PENDING') {
    const heading = gate.querySelector('h1');
    const description = gate.querySelector('.lock-card > p:not(.eyebrow)');
    if (heading) heading.textContent = 'Dossier Filing Pending';
    if (description) description.textContent = 'This investigator file has been prepared but has not yet been issued to its player.';
    if (form) form.hidden = true;
    if (status) status.textContent = '';
    return;
  }

  function unlock() {
    localStorage.setItem(lastDossierKey, slug);
    gate.hidden = true;
    protectedShell.hidden = false;
    document.body.classList.remove('is-locked');
    window.dispatchEvent(new CustomEvent('rippers:dossier-unlocked', { detail: { slug } }));
    window.setTimeout(() => {
      const heading = protectedShell.querySelector('.workspace-titlebar h1, main h1');
      if (heading) {
        heading.setAttribute('tabindex', '-1');
        heading.focus({ preventScroll: true });
      }
    }, 0);
  }

  if (localStorage.getItem(storageKey) === verifier) {
    unlock();
    return;
  }

  form?.addEventListener('submit', async event => {
    event.preventDefault();
    const password = (input?.value || '').trim().toUpperCase();
    if (!password) {
      announce('Enter your dossier password.', true);
      return;
    }

    announce('Checking dossier key…');
    setWorking(true);
    try {
      const candidate = await deriveVerifier(password, salt, iterations);
      if (candidate === verifier) {
        localStorage.setItem(storageKey, verifier);
        announce('Dossier unlocked.');
        unlock();
      } else {
        announce('That password does not open this dossier.', true);
        input?.select();
      }
    } catch (error) {
      announce('This browser could not verify the dossier password.', true);
    } finally {
      setWorking(false);
    }
  });
});
