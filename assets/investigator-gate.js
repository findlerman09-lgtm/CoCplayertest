window.addEventListener('DOMContentLoaded', () => {
  const gate = document.querySelector('[data-investigator-cabinet]');
  if (!gate) return;

  const candidates = [...gate.querySelectorAll('[data-dossier-candidate]')];
  const form = gate.querySelector('[data-dossier-key-form]');
  const input = form?.querySelector('input');
  const submit = form?.querySelector('button[type="submit"]');
  const status = gate.querySelector('[data-dossier-key-status]');
  const lastDossierKey = 'rippers-last-dossier';

  function storageKey(slug) {
    return `rippers-dossier-access:${slug}`;
  }

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

  function openDossier(candidate) {
    const slug = candidate.dataset.dossierSlug;
    const target = candidate.dataset.target;
    if (slug) localStorage.setItem(lastDossierKey, slug);
    if (target) window.location.assign(target);
  }

  const remembered = candidates.filter(candidate => {
    const slug = candidate.dataset.dossierSlug;
    return slug && localStorage.getItem(storageKey(slug)) === candidate.dataset.verifier;
  });

  if (remembered.length === 1) {
    announce('Dossier recognized. Opening…');
    openDossier(remembered[0]);
    return;
  }

  if (remembered.length > 1) {
    const lastSlug = localStorage.getItem(lastDossierKey);
    const last = remembered.find(candidate => candidate.dataset.dossierSlug === lastSlug);
    if (last) {
      announce('Last-used dossier recognized. Opening…');
      openDossier(last);
      return;
    }
    announce('More than one dossier is remembered on this device. Enter the password for the dossier you want to open.');
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
      for (const candidate of candidates) {
        const verifier = candidate.dataset.verifier;
        const derived = await rippersDeriveVerifier(
          password,
          candidate.dataset.salt,
          Number(candidate.dataset.iterations || 120000)
        );

        if (derived === verifier) {
          const slug = candidate.dataset.dossierSlug;
          localStorage.setItem(storageKey(slug), verifier);
          localStorage.setItem(lastDossierKey, slug);
          announce('Dossier key accepted.');
          if (input) input.value = '';
          openDossier(candidate);
          return;
        }
      }

      announce('That password does not open a dossier here.', true);
      input?.select();
    } catch {
      announce('This browser could not verify the dossier password.', true);
    } finally {
      setWorking(false);
    }
  });
});
