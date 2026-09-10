(() => {
  const keyFor = id => `rippers-unlock-${id}`;
  const titleKeyFor = id => `rippers-unlock-title-${id}`;
  const timeKeyFor = id => `rippers-unlock-time-${id}`;
  const memoryKeyFor = id => `rippers-unlock-memory-${id}`;

  function isReleased(id) {
    return Boolean(id && localStorage.getItem(keyFor(id)));
  }

  function dependenciesMet(record) {
    const dependencies = (record.dataset.releaseDependsAny || '')
      .split(',')
      .map(value => value.trim())
      .filter(Boolean);
    return dependencies.length === 0 || dependencies.some(isReleased);
  }

  function refreshDependencyVisibility() {
    document.querySelectorAll('[data-simple-case-release][data-hidden-until-dependency]').forEach((record) => {
      record.hidden = !(isReleased(record.dataset.lockId) || dependenciesMet(record));
    });
  }

  function rememberCaseMemory(record, lockId) {
    const kind = record.dataset.memoryKind;
    const name = (record.dataset.memoryName || '').trim();
    if (!kind || !name) return;

    const memory = { people: [], locations: [] };
    const item = { name, note: (record.dataset.memoryNote || '').trim() };
    if (kind === 'person') memory.people.push(item);
    if (kind === 'location') memory.locations.push(item);
    if (!memory.people.length && !memory.locations.length) return;
    localStorage.setItem(memoryKeyFor(lockId), JSON.stringify(memory));
  }

  function showImage(record) {
    const image = record.querySelector('[data-simple-release-image]');
    if (!image || image.getAttribute('src')) return;

    const error = document.createElement('p');
    error.className = 'released-art-error';
    error.textContent = 'The released image could not be loaded. Its descriptive text remains available.';
    error.hidden = true;
    image.closest('figure')?.appendChild(error);

    image.addEventListener('error', () => {
      image.hidden = true;
      error.hidden = false;
    }, { once: true });
    image.src = image.dataset.src;
  }

  function showReleased(record, { persist = true, announce = true } = {}) {
    const lockId = record.dataset.lockId;
    if (!lockId) return;

    record.hidden = false;
    record.open = true;
    record.classList.remove('is-sealed');
    record.classList.add('is-unlocked');

    const sealed = record.querySelector('[data-simple-release-sealed]');
    const body = record.querySelector('[data-simple-release-body]');
    const status = record.querySelector('[data-release-status]');
    const title = record.querySelector('[data-release-title]');
    const revealedTitle = record.dataset.revealedTitle || 'Released Visual Record';

    if (sealed) sealed.hidden = true;
    if (body) body.hidden = false;
    if (status) {
      status.textContent = 'OPEN';
      status.classList.remove('sealed');
      status.classList.add('available');
    }
    if (title) title.textContent = revealedTitle;
    showImage(record);

    if (persist) {
      localStorage.setItem(keyFor(lockId), 'released');
      localStorage.setItem(titleKeyFor(lockId), revealedTitle);
      if (!localStorage.getItem(timeKeyFor(lockId))) {
        localStorage.setItem(timeKeyFor(lockId), String(Date.now()));
      }
      rememberCaseMemory(record, lockId);
    }

    if (announce) {
      window.dispatchEvent(new CustomEvent('rippers:document-unlocked', {
        detail: { lockId, title: revealedTitle }
      }));
    }
  }

  function installRecord(record) {
    const lockId = record.dataset.lockId;
    if (!lockId) return;

    if (isReleased(lockId)) {
      showReleased(record, { persist: false, announce: false });
      return;
    }

    if (record.hasAttribute('data-hidden-until-dependency')) {
      record.hidden = !dependenciesMet(record);
    } else {
      record.hidden = false;
    }

    const button = record.querySelector('[data-simple-release-button]');
    button?.addEventListener('click', () => showReleased(record));
  }

  window.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-simple-case-release]').forEach(installRecord);
    refreshDependencyVisibility();
  });

  window.addEventListener('rippers:document-unlocked', refreshDependencyVisibility);
  window.addEventListener('storage', (event) => {
    if (event.key?.startsWith('rippers-unlock-')) refreshDependencyVisibility();
  });
})();
