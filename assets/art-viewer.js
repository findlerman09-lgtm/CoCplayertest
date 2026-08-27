function rippersEnsureArtViewer() {
  let dialog = document.querySelector('[data-art-viewer-dialog]');
  if (dialog) return dialog;

  dialog = document.createElement('dialog');
  dialog.className = 'art-viewer-dialog';
  dialog.setAttribute('data-art-viewer-dialog', '');
  dialog.innerHTML = `
    <div class="art-viewer-shell">
      <div class="art-viewer-toolbar">
        <span data-art-viewer-label>Image inspection</span>
        <button type="button" class="art-viewer-close" data-art-viewer-close>Close</button>
      </div>
      <div class="art-viewer-stage"><img data-art-viewer-image alt=""></div>
      <p class="art-viewer-caption" data-art-viewer-caption></p>
    </div>`;
  document.body.appendChild(dialog);

  const close = () => dialog.close();
  dialog.querySelector('[data-art-viewer-close]')?.addEventListener('click', close);
  dialog.addEventListener('click', event => {
    if (event.target === dialog) close();
  });
  return dialog;
}

function rippersOpenArtViewer(trigger) {
  const dialog = rippersEnsureArtViewer();
  const image = dialog.querySelector('[data-art-viewer-image]');
  const caption = dialog.querySelector('[data-art-viewer-caption]');
  const label = dialog.querySelector('[data-art-viewer-label]');
  const fallbackImage = trigger.querySelector('img');
  const src = trigger.dataset.artSrc || fallbackImage?.currentSrc || fallbackImage?.src;
  if (!src || !image) return;

  const alt = trigger.dataset.artAlt || fallbackImage?.alt || '';
  const captionText = trigger.dataset.artCaption || '';
  image.src = src;
  image.alt = alt;
  if (caption) caption.textContent = captionText;
  if (label) label.textContent = captionText || alt || 'Image inspection';

  dialog.addEventListener('close', () => trigger.focus({ preventScroll: true }), { once: true });
  dialog.showModal();
}

function rippersInstallArtViewer() {
  if (document.documentElement.dataset.rippersArtViewerInstalled === 'true') return;
  document.documentElement.dataset.rippersArtViewerInstalled = 'true';
  document.addEventListener('click', event => {
    const trigger = event.target.closest?.('[data-art-viewer]');
    if (!trigger) return;
    event.preventDefault();
    rippersOpenArtViewer(trigger);
  });
}

if (document.readyState === 'loading') {
  window.addEventListener('DOMContentLoaded', rippersInstallArtViewer, { once: true });
} else {
  rippersInstallArtViewer();
}
