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
      state.lastSanNotice = `Further SAN loss while insane triggers another bout of madness. Period loss is ${state.sanityPeriodLoss} of ${sanityThreshold()}.`;
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
    state.lastSanNotice = `New SAN-loss period started at ${state.sanity} SAN. Existing insanity conditions are unchanged.`;
    saveState();
  });

  document.querySelector('[data-clear-sanity-condition]')?.addEventListener('click', () => {
    state.temporaryCheckPending = false;
    state.temporaryInsanity = false;
    state.indefiniteInsanity = false;
    state.lastSanNotice = 'Insanity condition cleared by Keeper decision. SAN totals and previous private effects are unchanged.';
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
});
