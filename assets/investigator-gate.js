window.addEventListener('DOMContentLoaded', () => {
  const cabinet = document.querySelector('[data-investigator-cabinet]');
  if (!cabinet) return;

  const candidates = [...cabinet.querySelectorAll('[data-dossier-candidate]')];
  const form = cabinet.querySelector('[data-dossier-key-form]');
  const input = form?.querySelector('input');
  const status = cabinet.querySelector('[data-dossier-key-status]');

  function storageKey(slug) {
    return `rippers-dossier-access:${slug}`;
  }

  function revealCard(card) {
    card.classList.remove('is-sealed');
    card.classList.add('is-unlocked');
    const sealed = card.querySelector('[data-sealed-face]');
    const open = card.querySelector('[data-unlocked-face]');
    if (sealed) sealed.hidden = true;
    if (open) open.hidden = false;
  }

  candidates.forEach(card => {
    const slug = card.dataset.dossierSlug;
    const verifier = card.dataset.verifier;
    if (slug && localStorage.getItem(storageKey(slug)) === verifier) revealCard(card);
  });

  form?.addEventListener('submit', async event => {
    event.preventDefault();
    const password = input?.value || '';
    if (!password) {
      status.textContent = 'Enter your dossier key.';
      return;
    }

    status.textContent = 'Checking dossier key…';
    form.classList.add('is-working');

    try {
      for (const card of candidates) {
        const salt = card.dataset.salt;
        const verifier = card.dataset.verifier;
        const iterations = Number(card.dataset.iterations || 120000);
        const candidate = await rippersDeriveVerifier(password, salt, iterations);
        if (candidate === verifier) {
          const slug = card.dataset.dossierSlug;
          localStorage.setItem(storageKey(slug), verifier);
          revealCard(card);
          status.textContent = 'Dossier key accepted.';
          input.value = '';
          card.scrollIntoView({ behavior: 'smooth', block: 'center' });
          return;
        }
      }
      status.textContent = 'That key does not open a dossier here.';
      input.select();
    } catch {
      status.textContent = 'This browser could not verify the dossier key.';
    } finally {
      form.classList.remove('is-working');
    }
  });
});
