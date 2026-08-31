(() => {
  const cache = new Map();
  const files = {
    'arthur-bell': 'a1-por-001-player.webp.base64.txt',
    'thomas-merrick': 'a1-por-002-player.b64.txt',
    'miriam-hart': 'a1-por-003-player.b64.txt',
    'clara-mercer': 'a1-por-004-player.b64.txt',
    'laurence-kersey': 'a1-por-005-player.b64.txt'
  };
  const scriptSrc = document.currentScript?.src || '';

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

  async function setPortrait(image, url, reveal = false) {
    const data = await portraitData(url);
    await new Promise((resolve, reject) => {
      image.addEventListener('load', resolve, { once: true });
      image.addEventListener('error', reject, { once: true });
      image.src = `data:image/webp;base64,${data}`;
    });
    if (reveal) image.hidden = false;
    return image.src;
  }

  async function loadOverviewPortrait(image) {
    const url = image.dataset.portraitB64;
    if (!url) return;
    try {
      const dataUrl = await setPortrait(image, url, true);
      const parent = image.parentElement;
      const placeholder = parent && parent.querySelector('[data-portrait-placeholder]');
      if (placeholder) placeholder.hidden = true;
      document.querySelectorAll('.context-identity img').forEach((mirror) => {
        mirror.src = dataUrl;
      });
      image.removeAttribute('data-portrait-b64');
      image.classList.add('portrait-loaded');
    } catch (error) {
      // Keep the neutral dossier fallback if a derivative cannot be loaded.
      image.dispatchEvent(new CustomEvent('rippers:portrait-error', { bubbles: true }));
    }
  }

  const overviewImages = [...document.querySelectorAll('img[data-portrait-b64]')];
  overviewImages.forEach(loadOverviewPortrait);

  if (overviewImages.length === 0 && scriptSrc) {
    const match = window.location.pathname.match(/\/characters\/([^/]+)/);
    const filename = match && files[match[1]];
    const contextImage = document.querySelector('.context-identity img');
    if (filename && contextImage) {
      const url = new URL(`images/portraits/${filename}`, scriptSrc).href;
      setPortrait(contextImage, url).catch(() => {
        // The neutral R dossier plate remains if an approved derivative cannot load.
      });
    }
  }
})();
