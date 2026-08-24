window.addEventListener('DOMContentLoaded', () => {
  const root = document.querySelector('[data-character-state]');
  if (!root) return;

  const slug = root.dataset.characterState;
  const version = root.dataset.stateVersion || '1';
  const maxHp = Number(root.dataset.maxHp || root.dataset.defaultHp || 0);
  const maxSanity = Number(root.dataset.maxSanity || 99);
  const defaults = {
    hp: Number(root.dataset.defaultHp || 0),
    sanity: Number(root.dataset.defaultSanity || 0),
    luck: Number(root.dataset.defaultLuck || 0),
    majorWound: false,
    fatalDamage: false,
    temporaryCheckPending: false,
    temporaryInsanity: false,
    indefiniteInsanity: false,
    sanityPeriodStart: Number(root.dataset.defaultSanity || 0),
    sanityPeriodLoss: 0,
    lastHpNotice: '',
    lastSanNotice: '',
    skillChecks: []
  };

  const storageKey = `rippers-character-state:${slug}`;
  const legacyKey = `rippers-character-state:${slug}:v${version}`;
  const privateEffectsKey = `rippers-private-effects:${slug}`;

  function readStored(key) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  function loadState() {
    const stable = readStored(storageKey);
    if (stable) return { ...defaults, ...stable };

    const legacy = readStored(legacyKey);
    if (legacy) {
      const migrated = { ...defaults, ...legacy };
      localStorage.setItem(storageKey, JSON.stringify(migrated));
      return migrated;
    }

    return { ...defaults };
  }

  let state = loadState();

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function sanityThreshold() {
    return Math.max(1, Math.ceil(Number(state.sanityPeriodStart || state.sanity || 1) / 5));
  }

  function activeInsanityLabel() {
    if (state.sanity <= 0) return 'Permanent insanity';
    if (state.indefiniteInsanity) return 'Indefinite insanity';
    if (state.temporaryInsanity) return 'Temporary insanity';
    if (state.temporaryCheckPending) return 'INT check pending';
    return '';
  }

  function hpCondition() {
    if (state.fatalDamage) return { label: 'Death', className: 'critical' };
    if (state.hp <= 0 && state.majorWound) return { label: 'Dying', className: 'critical' };
    if (state.hp <= 0) return { label: 'Unconscious', className: 'warning' };
    if (state.majorWound) return { label: 'Major Wound', className: 'warning' };
    return { label: 'Stable', className: 'stable' };
  }

  function sanityCondition() {
    if (state.sanity <= 0) return { label: 'Permanent Insanity', className: 'critical' };
    if (state.indefiniteInsanity) return { label: 'Indefinite Insanity', className: 'critical' };
    if (state.temporaryInsanity) return { label: 'Temporary Insanity', className: 'warning' };
    if (state.temporaryCheckPending) return { label: 'INT Check Required', className: 'warning' };
    return { label: 'Stable', className: 'stable' };
  }

  function emit(type, detail = {}) {
    window.dispatchEvent(new CustomEvent(`rippers:${type}`, { detail: { slug, ...detail } }));
  }

  function saveState() {
    localStorage.setItem(storageKey, JSON.stringify(state));
    render();
    window.dispatchEvent(new CustomEvent('rippers:state-change', { detail: { slug, state } }));
  }

  function renderCondition(selector, condition) {
    document.querySelectorAll(selector).forEach(el => {
      el.textContent = condition.label;
      el.classList.remove('stable', 'warning', 'critical');
      el.classList.add(condition.className);
    });
  }

  function render() {
    document.querySelectorAll('[data-state-display="hp"]').forEach(el => el.textContent = state.hp);
    document.querySelectorAll('[data-state-display="sanity"]').forEach(el => el.textContent = state.sanity);
    document.querySelectorAll('[data-state-display="luck"]').forEach(el => el.textContent = state.luck);

    document.querySelectorAll('[data-state-input]').forEach(input => {
      const key = input.dataset.stateInput;
      if (key === 'majorWound') input.checked = Boolean(state.majorWound);
      else input.value = state[key];
    });

    document.querySelectorAll('[data-skill-check]').forEach(input => {
      input.checked = state.skillChecks.includes(input.dataset.skillCheck);
    });

    document.querySelectorAll('[data-sanity-period-loss]').forEach(el => el.textContent = state.sanityPeriodLoss);
    document.querySelectorAll('[data-sanity-period-start]').forEach(el => el.textContent = state.sanityPeriodStart);
    document.querySelectorAll('[data-sanity-threshold]').forEach(el => el.textContent = sanityThreshold());

    renderCondition('[data-hp-condition]', hpCondition());
    renderCondition('[data-san-condition]', sanityCondition());

    document.querySelectorAll('[data-hp-alert]').forEach(el => {
      el.textContent = state.lastHpNotice || 'Enter damage from one attack to apply wound rules automatically.';
    });
    document.querySelectorAll('[data-san-alert]').forEach(el => {
      el.textContent = state.lastSanNotice || 'Enter SAN lost from one event to test one-time and cumulative thresholds.';
    });

    document.querySelectorAll('[data-sanity-control-note]').forEach(el => {
      const active = activeInsanityLabel();
      if (state.sanity <= 0) {
        el.textContent = 'SAN is 0: permanent insanity cannot be ended with the condition control.';
      } else if (state.temporaryInsanity || state.indefiniteInsanity) {
        el.textContent = `${active} is still active. Resetting cumulative SAN loss does not end it; any further SAN loss will cause another bout until End insanity condition is used.`;
      } else if (state.temporaryCheckPending) {
        el.textContent = 'Resolve the pending INT check before treating the investigator as recovered.';
      } else {
        el.textContent = 'Resetting cumulative loss starts a fresh one-fifth threshold.';
      }
    });

    document.querySelectorAll('[data-temp-resolution-panel]').forEach(el => {
      el.hidden = !state.temporaryCheckPending;
    });

    const improvementList = document.querySelector('[data-improvement-list]');
    if (improvementList) {
      const checked = [...document.querySelectorAll('[data-skill-check]:checked')];
      improvementList.innerHTML = checked.length
        ? checked.map(input => `<li><span>${input.dataset.skillName}</span><b>${input.dataset.skillValue}%</b></li>`).join('')
        : '<li class="empty-improvement">No skill checks marked yet.</li>';
    }
  }

  function setupStateSettings() {
    const lockButton = document.querySelector('.lock-dossier-button');
    const railPanel = lockButton?.closest('.rail-panel');
    if (!railPanel || railPanel.querySelector('[data-state-settings-open]')) return;

    const trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = 'state-settings-trigger';
    trigger.dataset.stateSettingsOpen = '';
    trigger.setAttribute('aria-label', 'Player state settings');
    trigger.title = 'Player state settings';
    trigger.textContent = '⚙';
    railPanel.append(trigger);

    const dialog = document.createElement('dialog');
    dialog.className = 'state-settings-dialog';
    dialog.innerHTML = `
      <div class="state-settings-head">
        <div><small>Local dossier</small><strong>Player State</strong></div>
        <button type="button" data-state-settings-close aria-label="Close settings">×</button>
      </div>
      <p>Back up or restore this investigator's current HP, SAN, Luck, improvement marks, Major Wounds, and private mental effects.</p>
      <div class="state-settings-actions">
        <button type="button" data-export-player-state>Export state</button>
        <label class="state-import-button">Import state<input type="file" accept="application/json,.json" data-import-player-state hidden></label>
      </div>
      <p class="state-settings-note">The backup does not contain the dossier password or archive key.</p>
      <p class="state-settings-status" data-state-settings-status></p>
    `;
    document.body.append(dialog);

    const status = dialog.querySelector('[data-state-settings-status]');
    const importInput = dialog.querySelector('[data-import-player-state]');

    function openDialog() {
      if (typeof dialog.showModal === 'function') dialog.showModal();
      else dialog.setAttribute('open', '');
    }

    function closeDialog() {
      if (typeof dialog.close === 'function') dialog.close();
      else dialog.removeAttribute('open');
    }

    trigger.addEventListener('click', openDialog);
    dialog.querySelector('[data-state-settings-close]')?.addEventListener('click', closeDialog);
    dialog.addEventListener('click', event => {
      if (event.target === dialog) closeDialog();
    });

    dialog.querySelector('[data-export-player-state]')?.addEventListener('click', () => {
      const payload = {
        format: 'rippers-player-state',
        version: 1,
        character: slug,
        exportedAt: new Date().toISOString(),
        characterState: state,
        privateEffects: readStored(privateEffectsKey)
      };

      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const day = new Date().toISOString().slice(0, 10);
      link.href = url;
      link.download = `rippers-${slug}-state-${day}.json`;
      document.body.append(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      if (status) status.textContent = 'State backup exported.';
    });

    importInput?.addEventListener('change', async () => {
      const file = importInput.files?.[0];
      if (!file) return;

      try {
        const payload = JSON.parse(await file.text());
        if (payload?.format !== 'rippers-player-state' || payload?.version !== 1) {
          throw new Error('That file is not a Rippers player-state backup.');
        }
        if (payload.character !== slug) {
          throw new Error('That backup belongs to a different investigator.');
        }
        if (!payload.characterState || typeof payload.characterState !== 'object') {
          throw new Error('The backup does not contain character state.');
        }

        const confirmed = window.confirm('Replace this device\'s current tracker state with the imported backup?');
        if (!confirmed) {
          importInput.value = '';
          return;
        }

        localStorage.setItem(storageKey, JSON.stringify({ ...defaults, ...payload.characterState }));
        if (payload.privateEffects && typeof payload.privateEffects === 'object') {
          localStorage.setItem(privateEffectsKey, JSON.stringify(payload.privateEffects));
        } else {
          localStorage.removeItem(privateEffectsKey);
        }

        if (status) status.textContent = 'State restored. Reloading…';
        window.setTimeout(() => window.location.reload(), 250);
      } catch (error) {
        if (status) status.textContent = error?.message || 'That backup could not be imported.';
        importInput.value = '';
      }
    });
  }

  document.querySelectorAll('[data-state-delta]').forEach(button => {
    button.addEventListener('click', () => {
      const key = button.dataset.stateKey;
      const delta = Number(button.dataset.stateDelta);
      const max = Number(button.dataset.stateMax || 999);
      state[key] = clamp(Number(state[key]) + delta, 0, max);
      saveState();
    });
  });

  document.querySelectorAll('[data-state-input]').forEach(input => {
    input.addEventListener('change', () => {
      const key = input.dataset.stateInput;
      if (key === 'majorWound') {
        const wasMarked = Boolean(state.majorWound);
        state.majorWound = input.checked;
        saveState();
        if (!wasMarked && state.majorWound) emit('major-wound', { source: 'manual' });
        return;
      }

      const max = Number(input.max || 999);
      state[key] = clamp(Number(input.value), 0, max);
      saveState();
    });
  });

  document.querySelector('[data-apply-damage]')?.addEventListener('click', () => {
    const input = document.querySelector('[data-damage-entry]');
    const damage = Math.max(0, Math.floor(Number(input?.value || 0)));
    if (!damage) return;

    const majorThreshold = Math.ceil(maxHp / 2);
    state.hp = clamp(state.hp - damage, 0, maxHp);

    if (damage > maxHp) {
      state.fatalDamage = true;
      state.majorWound = true;
      state.lastHpNotice = `Fatal injury: ${damage} damage from one attack exceeds maximum HP (${maxHp}).`;
    } else if (damage >= majorThreshold) {
      state.majorWound = true;
      state.lastHpNotice = state.hp <= 0
        ? 'Major Wound and 0 HP: the investigator is dying. First Aid is required to stabilize them.'
        : `Major Wound: ${damage} damage is at least half maximum HP. Fall prone and make a CON roll to remain conscious.`;
      emit('major-wound', { source: 'damage', damage });
    } else if (state.hp <= 0) {
      state.lastHpNotice = '0 HP without a Major Wound: the investigator is unconscious, but is not dying from this injury.';
    } else {
      state.lastHpNotice = `${damage} damage applied. No new Major Wound threshold was reached.`;
    }

    if (input) input.value = '';
    saveState();
  });

  document.querySelector('[data-apply-sanity-loss]')?.addEventListener('click', () => {
    const input = document.querySelector('[data-sanity-loss-entry]');
    const requestedLoss = Math.max(0, Math.floor(Number(input?.value || 0)));
    if (!requestedLoss) return;

    const wasUnderlying = Boolean(state.temporaryInsanity || state.indefiniteInsanity);
    const actualLoss = Math.min(requestedLoss, state.sanity);
    state.sanity = clamp(state.sanity - actualLoss, 0, maxSanity);
    state.sanityPeriodLoss += actualLoss;
    state.temporaryCheckPending = false;

    if (state.sanity <= 0) {
      state.temporaryInsanity = false;
      state.indefiniteInsanity = false;
      state.lastSanNotice = 'SAN has reached 0: permanent insanity.';
      emit('madness-bout', { reason: 'permanent', sanityLoss: actualLoss });
    } else if (wasUnderlying) {
      if (state.sanityPeriodLoss >= sanityThreshold()) {
        state.indefiniteInsanity = true;
        state.temporaryInsanity = false;
      }
      state.lastSanNotice = `Further SAN loss while an insanity condition is active triggers another bout. Cumulative period loss is ${state.sanityPeriodLoss} of ${sanityThreshold()}.`;
      emit('madness-bout', { reason: 'further-loss', sanityLoss: actualLoss });
    } else if (state.sanityPeriodLoss >= sanityThreshold()) {
      state.indefiniteInsanity = true;
      state.temporaryInsanity = false;
      state.lastSanNotice = `Cumulative SAN loss is ${state.sanityPeriodLoss}, reaching the one-fifth threshold of ${sanityThreshold()}: indefinite insanity.`;
      emit('madness-bout', { reason: 'indefinite', sanityLoss: actualLoss });
    } else if (actualLoss >= 5) {
      state.temporaryCheckPending = true;
      state.lastSanNotice = `${actualLoss} SAN lost from one event. Make an INT roll: success means temporary insanity; failure means the investigator retains control.`;
    } else {
      state.lastSanNotice = `${actualLoss} SAN lost. Period loss is ${state.sanityPeriodLoss} of ${sanityThreshold()} toward the indefinite-insanity threshold.`;
    }

    if (input) input.value = '';
    saveState();
  });

  document.querySelectorAll('[data-temp-resolution]').forEach(button => {
    button.addEventListener('click', () => {
      const result = button.dataset.tempResolution;
      state.temporaryCheckPending = false;
      if (result === 'success') {
        state.temporaryInsanity = true;
        state.lastSanNotice = 'INT roll succeeded: temporary insanity marked. A private bout has been assigned below.';
        emit('madness-bout', { reason: 'temporary' });
      } else {
        state.temporaryInsanity = false;
        state.lastSanNotice = 'INT roll failed: no temporary insanity from that one-time loss.';
      }
      saveState();
    });
  });

  document.querySelector('[data-reset-sanity-period]')?.addEventListener('click', () => {
    state.sanityPeriodStart = state.sanity;
    state.sanityPeriodLoss = 0;
    const active = activeInsanityLabel();
    state.lastSanNotice = (state.temporaryInsanity || state.indefiniteInsanity)
      ? `Cumulative SAN-loss period reset at ${state.sanity} SAN. ${active} remains active; any further SAN loss will cause another bout until End insanity condition is used.`
      : `Cumulative SAN-loss period reset at ${state.sanity} SAN. A fresh one-fifth threshold is now being tracked.`;
    saveState();
  });

  document.querySelector('[data-clear-sanity-condition]')?.addEventListener('click', () => {
    if (state.sanity <= 0) {
      state.lastSanNotice = 'SAN is 0: permanent insanity cannot be ended with this control.';
      saveState();
      return;
    }

    state.temporaryCheckPending = false;
    state.temporaryInsanity = false;
    state.indefiniteInsanity = false;
    state.lastSanNotice = 'Insanity condition ended by Keeper decision. Remaining bout cards are cleared. SAN total and the cumulative SAN-loss period are unchanged.';
    saveState();
  });

  document.querySelectorAll('[data-skill-check]').forEach(input => {
    input.addEventListener('change', () => {
      const id = input.dataset.skillCheck;
      const checks = new Set(state.skillChecks);
      input.checked ? checks.add(id) : checks.delete(id);
      state.skillChecks = [...checks];
      saveState();
    });
  });

  document.querySelector('[data-clear-skill-checks]')?.addEventListener('click', () => {
    state.skillChecks = [];
    saveState();
  });

  document.querySelector('[data-reset-character-state]')?.addEventListener('click', () => {
    state = { ...defaults, skillChecks: [] };
    saveState();
    emit('tracker-reset');
  });

  render();
  setupStateSettings();
});
