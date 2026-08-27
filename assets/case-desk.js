function rippersUnlockIsOpen(lockId) {
  return Boolean(lockId && localStorage.getItem(`rippers-unlock-${lockId}`));
}

function rippersCaseDeskRefresh() {
  const entries = Array.from(document.querySelectorAll('[data-case-progress-lock]'));
  let opened = 0;
  const recent = [];

  entries.forEach(entry => {
    const lockId = entry.dataset.caseProgressLock;
    if (!lockId) return;

    const titleKey = `rippers-unlock-title-${lockId}`;
    const timeKey = `rippers-unlock-time-${lockId}`;
    const isOpen = rippersUnlockIsOpen(lockId);
    const storedTitle = localStorage.getItem(titleKey);
    const storedTime = Number(localStorage.getItem(timeKey) || 0);
    const status = entry.querySelector('[data-case-progress-status]');
    const title = entry.querySelector('[data-case-progress-title]');

    entry.classList.toggle('is-open', isOpen);
    entry.classList.toggle('is-sealed', !isOpen);

    if (isOpen) {
      opened += 1;
      if (status) status.textContent = 'OPEN';
      if (storedTitle && title) title.textContent = storedTitle;
      recent.push({
        title: storedTitle || entry.dataset.caseSafeTitle || title?.textContent || 'Opened record',
        href: entry.getAttribute('href') || '',
        time: storedTime
      });
    } else {
      if (status) status.textContent = 'SEALED';
      if (title && entry.dataset.caseSafeTitle) title.textContent = entry.dataset.caseSafeTitle;
    }
  });

  document.querySelectorAll('[data-case-desk-open]').forEach(el => {
    el.textContent = String(opened);
  });
  document.querySelectorAll('[data-case-desk-total]').forEach(el => {
    el.textContent = String(entries.length);
  });
  document.querySelectorAll('[data-case-desk-progress]').forEach(el => {
    const ratio = entries.length ? opened / entries.length : 0;
    el.style.setProperty('--case-progress', `${Math.round(ratio * 100)}%`);
    el.setAttribute('aria-valuenow', String(opened));
    el.setAttribute('aria-valuemax', String(entries.length));
  });

  const recentHost = document.querySelector('[data-case-recent]');
  const recentWrap = recentHost?.closest('[data-case-recent-wrap]');
  if (recentHost) {
    const recentItems = recent
      .filter(item => item.time > 0)
      .sort((a, b) => b.time - a.time)
      .slice(0, 3);

    if (!recentItems.length) {
      recentHost.hidden = true;
      if (recentWrap) recentWrap.hidden = true;
      recentHost.innerHTML = '';
    } else {
      recentHost.hidden = false;
      if (recentWrap) recentWrap.hidden = false;
      recentHost.innerHTML = recentItems.map(item => {
        const date = new Date(item.time);
        const stamp = Number.isNaN(date.getTime()) ? 'Opened on this device' : `Opened ${date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`;
        const tag = item.href ? 'a' : 'div';
        const href = item.href ? ` href="${item.href}"` : '';
        return `<${tag} class="case-recent-entry"${href}><small>${stamp}</small><strong>${item.title}</strong></${tag}>`;
      }).join('');
    }
  }

  const openedLinks = Array.from(document.querySelectorAll('[data-case-file-opened-link]'));
  let openedLinksCount = 0;
  openedLinks.forEach(link => {
    const isOpen = rippersUnlockIsOpen(link.dataset.caseFileOpenedLink);
    link.hidden = !isOpen;
    if (isOpen) {
      openedLinksCount += 1;
      const title = localStorage.getItem(`rippers-unlock-title-${link.dataset.caseFileOpenedLink}`);
      const titleNode = link.querySelector('[data-case-file-opened-title]');
      if (title && titleNode) titleNode.textContent = title;
    }
  });
  document.querySelectorAll('[data-case-file-open-count]').forEach(el => {
    el.textContent = String(openedLinksCount);
  });
  document.querySelectorAll('[data-case-file-open-empty]').forEach(el => {
    el.hidden = openedLinksCount > 0;
  });
}

window.addEventListener('DOMContentLoaded', rippersCaseDeskRefresh);
window.addEventListener('rippers:document-unlocked', rippersCaseDeskRefresh);
window.addEventListener('storage', event => {
  if (event.key?.startsWith('rippers-unlock-')) rippersCaseDeskRefresh();
});
