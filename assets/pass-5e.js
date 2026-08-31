function rippersReadableStateKey(key) {
  if (key === 'hp') return 'hit points';
  if (key === 'sanity') return 'sanity';
  if (key === 'luck') return 'luck';
  return key || 'value';
}

function rippersRefreshRecentUnlocks(lockId = null) {
  document.querySelectorAll('[data-recent-lock-id]').forEach(link => {
    const itemLockId = link.dataset.recentLockId;
    if (lockId && itemLockId !== lockId) return;

    const unlocked = Boolean(localStorage.getItem(`rippers-unlock-${itemLockId}`));
    const label = link.querySelector('strong');
    if (label) {
      label.textContent = unlocked
        ? (link.dataset.recentOpenLabel || link.dataset.recentClosedLabel || label.textContent)
        : (link.dataset.recentClosedLabel || label.textContent);
    }
    link.classList.toggle('is-opened', unlocked);
  });
}

function rippersLoadCompanionScript(filename) {
  const current = document.currentScript;
  if (!current?.src) return;
  const src = new URL(filename, current.src).href;
  if (document.querySelector(`script[src="${src}"]`)) return;
  const script = document.createElement('script');
  script.src = src;
  script.async = false;
  document.head.appendChild(script);
}

rippersLoadCompanionScript('art-viewer.js');
rippersLoadCompanionScript('rehearsal-tools.js');
rippersLoadCompanionScript('portrait-loader.js');

window.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.global-nav a.active, .context-nav a.active').forEach(link => {
    link.setAttribute('aria-current', 'page');
  });

  document.querySelectorAll('.tracker-value-row button[data-state-key][data-state-delta]').forEach(button => {
    const direction = Number(button.dataset.stateDelta) > 0 ? 'Increase' : 'Decrease';
    const label = rippersReadableStateKey(button.dataset.stateKey);
    button.setAttribute('aria-label', `${direction} ${label} by 1`);
  });

  const damageButton = document.querySelector('[data-apply-damage]');
  if (damageButton) damageButton.setAttribute('aria-label', 'Apply damage from one attack');

  const sanityButton = document.querySelector('[data-apply-sanity-loss]');
  if (sanityButton) sanityButton.setAttribute('aria-label', 'Apply sanity loss from one event');

  rippersRefreshRecentUnlocks();
});

window.addEventListener('rippers:document-unlocked', event => {
  rippersRefreshRecentUnlocks(event.detail?.lockId || null);
});
