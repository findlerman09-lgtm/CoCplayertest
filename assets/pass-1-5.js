window.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-lock-dossier]').forEach(button => {
    button.addEventListener('click', () => {
      const slug = button.dataset.lockDossier;
      if (!slug) return;
      const confirmed = window.confirm('Lock this dossier on this device? Character sheet state will be retained.');
      if (!confirmed) return;
      localStorage.removeItem(`rippers-dossier-access:${slug}`);
      window.location.reload();
    });
  });
});
