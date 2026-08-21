window.addEventListener('DOMContentLoaded', () => {
  const gate = document.querySelector('[data-investigator-cabinet]');
  if (!gate) return;

  const candidates = [...gate.querySelectorAll('[data-dossier-candidate]')];
  const form = gate.querySelector('[data-dossier-key-form]');
  const input = form?.querySelector('input');
  const status = gate.querySelector('[data-dossier-key-status]');

  function storageKey(slug) {
    return `rippers-dossier-access:${slug}`;
  }

  function openDossier(candidate) {
    const target = candidate.dataset.target;
    if (target) window.location.assign(target);
  }

  const remembered = candidates.find(candidate => {
    const slug = candidate.dataset.dossierSlug;
    return slug && localStorage.getItem(storageKey(slug)) === candidate.dataset.verifier;
  });

  if (remembered) {
    if (status) status.textContent = 'Dossier recognized. Opening…';
    openDossier(remembered);
    return;
  }

  form?.addEventListener('submit', async event => {
    event.preventDefault();
    const password = input?.value || '';
    if (!password) {
      status.textContent = 'Enter your dossier password.';
      return;
    }

    status.textContent = 'Checking dossier key…';
    form.classList.add('is-working');

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
          status.textContent = 'Dossier key accepted.';
          input.value = '';
          openDossier(candidate);
          return;
        }
      }

      status.textContent = 'That password does not open a dossier here.';
      input.select();
    } catch {
      status.textContent = 'This browser could not verify the dossier password.';
    } finally {
      form.classList.remove('is-working');
    }
  });
});
