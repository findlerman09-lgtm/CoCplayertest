(() => {
  const cache = new Map();

  async function portraitData(url) {
    if (cache.has(url)) return cache.get(url);
    const request = fetch(url, { cache: 'force-cache', credentials: 'same-origin' })
      .then((response) => {
        if (!response.ok) throw new Error(`Portrait asset unavailable: ${response.status}`);
        return response.text();
      })
      .then((text) => text.replace(/\s+/g, ''));
    cache.set(url, request);
    return request;
  }

  async function loadPortrait(image) {
    const url = image.dataset.portraitB64;
    if (!url) return;
    try {
      const data = await portraitData(url);
      await new Promise((resolve, reject) => {
        image.addEventListener('load', resolve, { once: true });
        image.addEventListener('error', reject, { once: true });
        image.src = `data:image/webp;base64,${data}`;
      });
      image.hidden = false;
      const parent = image.parentElement;
      const placeholder = parent && parent.querySelector('[data-portrait-placeholder]');
      if (placeholder) placeholder.hidden = true;
      document.querySelectorAll('.context-identity img').forEach((mirror) => {
        mirror.src = image.src;
      });
      image.removeAttribute('data-portrait-b64');
      image.classList.add('portrait-loaded');
    } catch (error) {
      // Keep the neutral dossier fallback if a derivative cannot be loaded.
      image.dispatchEvent(new CustomEvent('rippers:portrait-error', { bubbles: true }));
    }
  }

  document.querySelectorAll('img[data-portrait-b64]').forEach(loadPortrait);
})();
