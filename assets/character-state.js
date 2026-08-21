window.addEventListener('DOMContentLoaded', () => {
  const root = document.querySelector('[data-character-state]');
  if (!root) return;

  const slug = root.dataset.characterState;
  const version = root.dataset.stateVersion || '1';
  const defaults = {
    hp: Number(root.dataset.defaultHp || 0),
    sanity: Number(root.dataset.defaultSanity || 0),
    luck: Number(root.dataset.defaultLuck || 0),
    majorWound: false,
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

  function saveState() {
    localStorage.setItem(storageKey, JSON.stringify(state));
    render();
    window.dispatchEvent(new CustomEvent('rippers:state-change', { detail: { slug, state } }));
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
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
      if (key === 'majorWound') state.majorWound = input.checked;
      else {
        const max = Number(input.max || 999);
        state[key] = clamp(Number(input.value), 0, max);
      }
      saveState();
    });
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
  });

  render();
});
