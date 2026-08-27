function rippersUnlockIsOpen(lockId) {
  return Boolean(lockId && localStorage.getItem(`rippers-unlock-${lockId}`));
}

function rippersOpenedCaseMemories() {
  const people = [];
  const locations = [];

  for (let index = 0; index < localStorage.length; index += 1) {
    const key = localStorage.key(index);
    if (!key?.startsWith('rippers-unlock-memory-')) continue;
    const lockId = key.slice('rippers-unlock-memory-'.length);
    if (!rippersUnlockIsOpen(lockId)) continue;

    try {
      const memory = JSON.parse(localStorage.getItem(key) || '{}');
      if (Array.isArray(memory.people)) people.push(...memory.people);
      if (Array.isArray(memory.locations)) locations.push(...memory.locations);
    } catch {
      // Ignore malformed local-only convenience state. It never controls clues.
    }
  }

  const unique = items => {
    const seen = new Set();
    return items.filter(item => {
      const name = String(item?.name || '').trim();
      if (!name) return false;
      const normalized = name.toLocaleLowerCase();
      if (seen.has(normalized)) return false;
      seen.add(normalized);
      item.name = name;
      item.note = String(item?.note || '').trim();
      return true;
    });
  };

  return { people: unique(people), locations: unique(locations) };
}

function appendKnownEntry(host, item, mark) {
  const entry = document.createElement('div');
  entry.className = 'case-known-entry case-known-entry-local';

  const symbol = document.createElement('span');
  symbol.className = 'person-initial';
  symbol.textContent = mark || item.name.slice(0, 1);

  const copy = document.createElement('div');
  const title = document.createElement('strong');
  title.textContent = item.name;
  copy.appendChild(title);

  if (item.note) {
    const note = document.createElement('p');
    note.textContent = item.note;
    copy.appendChild(note);
  }

  entry.append(symbol, copy);
  host.appendChild(entry);
}

function renderKnownCaseMemory(memories) {
  const basePeople = new Set(Array.from(document.querySelectorAll('[data-case-known-person-base]')).map(el => (el.dataset.caseKnownPersonBase || '').toLocaleLowerCase()));
  const baseLocations = new Set(Array.from(document.querySelectorAll('[data-case-known-location-base]')).map(el => (el.dataset.caseKnownLocationBase || '').toLocaleLowerCase()));
  const newPeople = memories.people.filter(item => !basePeople.has(item.name.toLocaleLowerCase()));
  const newLocations = memories.locations.filter(item => !baseLocations.has(item.name.toLocaleLowerCase()));

  document.querySelectorAll('[data-case-known-people]').forEach(host => {
    host.replaceChildren();
    newPeople.forEach(item => appendKnownEntry(host, item, item.name.slice(0, 1)));
  });
  document.querySelectorAll('[data-case-known-locations]').forEach(host => {
    host.replaceChildren();
    newLocations.forEach(item => appendKnownEntry(host, item, '⌖'));
  });

  document.querySelectorAll('[data-case-known-people-count]').forEach(el => {
    const base = Number(el.dataset.baseCount || 0);
    el.textContent = String(base + newPeople.length);
  });
  document.querySelectorAll('[data-case-known-location-count]').forEach(el => {
    const base = Number(el.dataset.baseCount || 0);
    el.textContent = String(base + newLocations.length);
  });
  document.querySelectorAll('[data-case-desk-people]').forEach(el => {
    const base = Number(el.dataset.baseCount || 0);
    el.textContent = String(base + newPeople.length);
  });
  document.querySelectorAll('[data-case-desk-locations]').forEach(el => {
    const base = Number(el.dataset.baseCount || 0);
    el.textContent = String(base + newLocations.length);
  });
}

function renderRecentRecords(recent) {
  const recentHost = document.querySelector('[data-case-recent]');
  const recentWrap = recentHost?.closest('[data-case-recent-wrap]');
  if (!recentHost) return;

  const recentItems = recent
    .filter(item => item.time > 0)
    .sort((a, b) => b.time - a.time)
    .slice(0, 3);

  recentHost.replaceChildren();
  if (!recentItems.length) {
    recentHost.hidden = true;
    if (recentWrap) recentWrap.hidden = true;
    return;
  }

  recentHost.hidden = false;
  if (recentWrap) recentWrap.hidden = false;

  recentItems.forEach(item => {
    const date = new Date(item.time);
    const stamp = Number.isNaN(date.getTime()) ? 'Opened on this device' : `Opened ${date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`;
    const entry = document.createElement(item.href ? 'a' : 'div');
    entry.className = 'case-recent-entry';
    if (item.href) entry.setAttribute('href', item.href);

    const small = document.createElement('small');
    small.textContent = stamp;
    const strong = document.createElement('strong');
    strong.textContent = item.title;
    entry.append(small, strong);
    recentHost.appendChild(entry);
  });
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

  renderRecentRecords(recent);

  const openedLinks = Array.from(document.querySelectorAll('[data-case-file-opened-link]'));
  let openedDocumentCount = 0;
  openedLinks.forEach(link => {
    const isOpen = rippersUnlockIsOpen(link.dataset.caseFileOpenedLink);
    link.hidden = !isOpen;
    if (isOpen) {
      openedDocumentCount += 1;
      const title = localStorage.getItem(`rippers-unlock-title-${link.dataset.caseFileOpenedLink}`);
      const titleNode = link.querySelector('[data-case-file-opened-title]');
      if (title && titleNode) titleNode.textContent = title;
    }
  });

  const openReleaseCount = Array.from(document.querySelectorAll('[data-release-record]')).filter(record => {
    if (record.hidden) return false;
    const lockId = record.querySelector('[data-lock-id]')?.dataset.lockId;
    return rippersUnlockIsOpen(lockId);
  }).length;

  document.querySelectorAll('[data-case-file-document-count]').forEach(el => {
    el.textContent = String(openedDocumentCount);
  });
  document.querySelectorAll('[data-case-file-open-count]').forEach(el => {
    el.textContent = String(openedDocumentCount + openReleaseCount);
  });
  document.querySelectorAll('[data-case-file-open-empty]').forEach(el => {
    el.hidden = openedDocumentCount > 0;
  });

  const visibleReleaseCount = Array.from(document.querySelectorAll('[data-release-record]')).filter(record => !record.hidden).length;
  document.querySelectorAll('[data-case-release-visible-count]').forEach(el => {
    el.textContent = String(visibleReleaseCount);
  });

  renderKnownCaseMemory(rippersOpenedCaseMemories());
}

window.addEventListener('DOMContentLoaded', rippersCaseDeskRefresh);
window.addEventListener('rippers:document-unlocked', rippersCaseDeskRefresh);
window.addEventListener('storage', event => {
  if (event.key?.startsWith('rippers-unlock-')) rippersCaseDeskRefresh();
});
