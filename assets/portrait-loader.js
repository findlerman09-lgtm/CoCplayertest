(() => {
  function setFallback(image, failed) {
    const host = image.parentElement;
    const placeholder = host?.querySelector('[data-portrait-placeholder]');
    image.hidden = failed;
    if (placeholder) placeholder.hidden = !failed;
    image.classList.toggle('portrait-loaded', !failed);
  }

  document.querySelectorAll('img[data-approved-portrait]').forEach((image) => {
    image.addEventListener('load', () => setFallback(image, false), { once: true });
    image.addEventListener('error', () => setFallback(image, true), { once: true });
    if (image.complete) setFallback(image, image.naturalWidth === 0);
  });
})();
