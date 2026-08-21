window.addEventListener('DOMContentLoaded', () => {
  const root = document.querySelector('[data-character-state]');
  if (!root) return;

  const slug = root.dataset.characterState;
  const storageKey = `rippers-private-effects:${slug}`;
  const stateKey = `rippers-character-state:${slug}`;

  const woundTable = [
    { title: 'Head or Face Trauma', detail: 'A ringing head, split brow, damaged cheek, or similar blow. Fit the exact description to the attack that caused it.' },
    { title: 'Rib or Chest Injury', detail: 'Breathing, twisting, or sudden exertion makes the injury impossible to ignore. Fit the exact description to the attack.' },
    { title: 'Shoulder or Upper Arm Injury', detail: 'One shoulder or upper arm has taken the worst of the impact. Decide which side makes sense in the fiction.' },
    { title: 'Hand or Wrist Injury', detail: 'A hand, wrist, or forearm is badly hurt. The precise wound follows from the weapon, fall, or impact that caused it.' },
    { title: 'Back or Torso Trauma', detail: 'The blow has left deep bruising, wrenching pain, or a serious strain through the back or torso.' },
    { title: 'Hip or Thigh Injury', detail: 'A hip or upper leg has absorbed the major injury. Interpret the exact wound to match the scene.' },
    { title: 'Knee or Lower-Leg Injury', detail: 'A knee, shin, ankle, or lower leg has been badly damaged. Match the detail to the source of harm.' },
    { title: 'Deep Laceration', detail: 'The injury leaves a deep cut or torn wound. Place it where the fiction makes most sense.' },
    { title: 'Puncture or Penetrating Wound', detail: 'Something has gone in deep enough to make this more than ordinary damage. The exact location follows the attack.' },
    { title: 'Crushing Bruise or Dislocation', detail: 'The impact has badly bruised, wrenched, or displaced something. Adapt the location to the fiction.' }
  ];

  const phobias = [
    'dark enclosed rooms',
    'open crowds and public squares',
    'blood and fresh wounds',
    'mirrors and reflected images',
    'being left alone',
    'fire and open flame',
    'deep or black water',
    'heights and exposed edges',
    'locked doors and confinement',
    'being watched from windows'
  ];

  const compulsions = [
    'checking doors, locks, and windows repeatedly',
    'keeping lamps or candles lit whenever possible',
    'counting small objects or repeated details',
    'writing down everything before trusting memory',
    'rearranging objects until they feel correct',
    'collecting scraps, tokens, or insignificant evidence',
    'washing hands or tools again and again',
    'listening at doors and around corners before entering',
    'repeating a familiar route or ritual before acting',
    'refusing to discard notes, receipts, or other records'
  ];

  const madnessTable = [
    { title: 'Memory Fracture', detail: 'Your memory of the immediate situation breaks apart. Play the disorientation until the Keeper says the bout has passed.' },
    { title: 'Psychosomatic Impairment', detail: 'For the bout, your body insists that a sense or limb will not function normally. Choose the manifestation that best fits the moment.' },
    { title: 'Violent Outburst', detail: 'Fear turns into destructive action. Direct the outburst toward whatever the character currently believes is the threat.' },
    { title: 'Paranoid Conviction', detail: 'For the bout, you become certain that someone nearby is lying, watching, betraying, or manipulating you.' },
    { title: 'Significant-Person Fixation', detail: 'Someone present becomes tangled in your feelings about an important person from your life. Act on that mistaken emotional connection.' },
    { title: 'Collapse', detail: 'The strain becomes physically overwhelming. You faint, freeze, or otherwise become briefly unable to function.' },
    { title: 'Flight', detail: 'Your only clear idea is to get away from the source of terror, even if doing so is inconvenient or dangerous.' },
    { title: 'Uncontrolled Emotional Reaction', detail: 'Laughter, tears, screaming, shaking, or another overwhelming reaction takes control for the bout.' },
    { title: 'New Phobia', detail: '' },
    { title: 'New Compulsion', detail: '' }
  ];

  function randomInt(max) {
    if (max <= 1) return 0;
    if (window.crypto?.getRandomValues) {
      const array = new Uint32Array(1);
      window.crypto.getRandomValues(array);
      return array[0] % max;
    }
    return Math.floor(Math.random() * max);
  }

  function d10() {
    return randomInt(10) + 1;
  }

  function loadEffects() {
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) return { wounds: [], madness: [] };
      const parsed = JSON.parse(raw);
      return {
        wounds: Array.isArray(parsed.wounds) ? parsed.wounds : [],
        madness: Array.isArray(parsed.madness) ? parsed.madness : []
      };
    } catch {
      return { wounds: [], madness: [] };
    }
  }

  let effects = loadEffects();

  function saveEffects() {
    localStorage.setItem(storageKey, JSON.stringify(effects));
    render();
  }

  function drawWound(source = 'damage') {
    const result = woundTable[randomInt(woundTable.length)];
    return {
      id: `${Date.now()}-${randomInt(100000)}`,
      title: result.title,
      detail: result.detail,
      source,
      createdAt: Date.now()
    };
  }

  function drawMadness(reason = 'insanity') {
    const result = { ...madnessTable[randomInt(madnessTable.length)] };
    if (result.title === 'New Phobia') {
      result.detail = `A new fear takes hold: ${phobias[randomInt(phobias.length)]}.`;
    } else if (result.title === 'New Compulsion') {
      result.detail = `A new compulsive urge takes hold: ${compulsions[randomInt(compulsions.length)]}.`;
    }

    return {
      id: `${Date.now()}-${randomInt(100000)}`,
      title: result.title,
      detail: result.detail,
      reason,
      duration: d10(),
      createdAt: Date.now()
    };
  }

  function effectArticle(item, type, index) {
    const article = document.createElement('article');
    article.className = 'private-effect-entry';

    const meta = document.createElement('small');
    meta.textContent = type === 'wound'
      ? `Private wound ${index + 1}`
      : `Private bout ${index + 1} · duration roll ${item.duration}`;

    const title = document.createElement('strong');
    title.textContent = item.title;

    const detail = document.createElement('p');
    detail.textContent = item.detail;

    article.append(meta, title, detail);

    if (type === 'wound') {
      const note = document.createElement('em');
      note.textContent = 'Narrative detail only: the Major Wound rules remain the mechanical effect.';
      article.append(note);
    } else {
      const note = document.createElement('em');
      note.textContent = 'You see this before the Keeper. Bring it into play; the Keeper decides how the scene accommodates it.';
      article.append(note);
    }

    return article;
  }

  function renderList(selector, items, type, emptyText) {
    const container = document.querySelector(selector);
    if (!container) return;
    container.replaceChildren();

    if (!items.length) {
      const empty = document.createElement('p');
      empty.className = 'empty-private-effect';
      empty.textContent = emptyText;
      container.append(empty);
      return;
    }

    [...items].reverse().forEach((item, reverseIndex) => {
      const index = items.length - reverseIndex - 1;
      container.append(effectArticle(item, type, index));
    });
  }

  function render() {
    renderList('[data-wound-effects]', effects.wounds, 'wound', 'No Major Wound has been assigned.');
    renderList('[data-madness-effects]', effects.madness, 'madness', 'No bout has been assigned.');
  }

  window.addEventListener('rippers:major-wound', event => {
    if (event.detail?.slug !== slug) return;
    effects.wounds.push(drawWound(event.detail?.source));
    saveEffects();
  });

  window.addEventListener('rippers:madness-bout', event => {
    if (event.detail?.slug !== slug) return;
    effects.madness.push(drawMadness(event.detail?.reason));
    saveEffects();
  });

  window.addEventListener('rippers:tracker-reset', event => {
    if (event.detail?.slug !== slug) return;
    effects = { wounds: [], madness: [] };
    localStorage.removeItem(storageKey);
    render();
  });

  try {
    const currentState = JSON.parse(localStorage.getItem(stateKey) || 'null');
    let changed = false;
    if (currentState?.majorWound && effects.wounds.length === 0) {
      effects.wounds.push(drawWound('existing-state'));
      changed = true;
    }
    if ((currentState?.temporaryInsanity || currentState?.indefiniteInsanity) && effects.madness.length === 0) {
      effects.madness.push(drawMadness('existing-state'));
      changed = true;
    }
    if (changed) localStorage.setItem(storageKey, JSON.stringify(effects));
  } catch {
    // Existing local state is optional; private effects can begin fresh.
  }

  render();
});
