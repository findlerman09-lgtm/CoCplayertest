(function (root) {
  'use strict';
  const math = typeof module !== 'undefined' ? require('./skill-values.js') : root.RippersSkillValues;
  const excluded = new Set(['credit-rating', 'cthulhu-mythos', 'luck', 'hp', 'hit-points', 'sanity', 'san',
    'str', 'con', 'siz', 'dex', 'app', 'int', 'pow', 'edu', 'mp', 'mov', 'build', 'db']);
  const own = (object, key) => Object.prototype.hasOwnProperty.call(object || {}, key);
  const copy = value => JSON.parse(JSON.stringify(value));
  const identity = (investigator, adventure, skill) => JSON.stringify([investigator, adventure, skill]);
  const validId = value => typeof value === 'string' && /^[a-z0-9][a-z0-9-]*$/.test(value);
  function eligible(skill) {
    return skill && validId(skill.id) && skill.kind === 'skill' && skill.improvable === true &&
      !excluded.has(skill.id) && !/^(Credit Rating|Cthulhu Mythos)$/i.test(skill.name);
  }
  function history(state) { return state.developmentHistory || []; }
  function contextReady(context, investigator) {
    return context && context.investigator_id === investigator && validId(context.adventure_id) &&
      typeof context.adventure_title === 'string' && context.adventure_title.trim() &&
      context.status === 'completed' && context.participated === true && context.active_adventure === false &&
      context.checks_complete === true && Array.isArray(context.checks) && context.checks.every(check =>
        check && validId(check.skill_id) && validId(check.adventure_id) &&
        typeof check.earned === 'boolean' && typeof check.resolved === 'boolean');
  }
  function checkedSkills(context, catalog) {
    return catalog.filter(skill => eligible(skill) && context.checks.some(check =>
      check.skill_id === skill.id && check.adventure_id === context.adventure_id &&
      check.earned === true && check.resolved === false));
  }
  function unmappedChecks(context, catalog) {
    return context.checks.some(check => check.adventure_id === context.adventure_id && check.earned && !check.resolved &&
      !excluded.has(check.skill_id) && !catalog.some(skill => skill.id === check.skill_id));
  }
  function view(state, context, investigator, catalog) {
    const records = history(state).filter(record => record.investigator_id === investigator);
    if (!contextReady(context, investigator) || unmappedChecks(context, catalog)) {
      return { status: 'LOCKED', remaining: [], records: [], archived: records };
    }
    const current = records.filter(record => record.adventure_id === context.adventure_id);
    const remaining = checkedSkills(context, catalog).filter(skill => !current.some(record => record.skill_id === skill.id));
    return {
      status: remaining.length ? (current.length ? 'IN PROGRESS' : 'AVAILABLE') : 'COMPLETE',
      remaining, records: current, archived: records.filter(record => record.adventure_id !== context.adventure_id)
    };
  }
  function completeSummary(state, context, investigator, catalog, now) {
    if (view(state, context, investigator, catalog).status !== 'COMPLETE') return false;
    if ((state.developmentSummaries || []).some(item => item.investigator_id === investigator && item.adventure_id === context.adventure_id)) return false;
    state.developmentSummaries = [...(state.developmentSummaries || []), {
      investigator_id: investigator, adventure_id: context.adventure_id, adventure_title: context.adventure_title,
      completed_at: now(), no_eligible_checks: !history(state).some(item => item.investigator_id === investigator && item.adventure_id === context.adventure_id)
    }];
    return true;
  }
  function secureDie(sides) {
    const range = 0x100000000;
    const ceiling = range - (range % sides);
    const word = new Uint32Array(1);
    do { root.crypto.getRandomValues(word); } while (word[0] >= ceiling);
    return (word[0] % sides) + 1;
  }
  // Called inside the character store's exclusive lock. Every write replaces
  // the SAME tracker envelope atomically, including SAN, values and audit.
  // No adventure/release writer is accepted by this API.
  function resolve({ read, write, context, investigator, skillId, catalog, maxSanity, die = secureDie,
    now = () => new Date().toISOString() }) {
    let state = copy(read());
    const id = identity(investigator, context?.adventure_id, skillId);
    const prior = history(state).find(record => record.development_id === id);
    if (prior) return copy(prior);
    if (!contextReady(context, investigator)) throw new Error('Development is locked until completion and participation are confirmed.');
    if (unmappedChecks(context, catalog)) throw new Error('An earned check has no matching sheet skill. Keeper reconciliation is required.');
    const skill = checkedSkills(context, catalog).find(item => item.id === skillId);
    if (!skill) throw new Error('This skill has no eligible unresolved check for this adventure.');
    const journal = state.developmentJournal;
    if (journal && journal.record.development_id !== id) throw new Error('Finish the recorded development check first.');
    if (journal && journal.phase.endsWith('-pending')) {
      throw new Error('A roll was interrupted before its result could be saved. Keeper review is required; it cannot be rolled again.');
    }
    if (!journal) {
      const pre = own(state.skillValues, skillId) ? state.skillValues[skillId] : skill.value;
      math.thresholds(pre);
      if (!Number.isSafeInteger(state.sanity) || !Number.isSafeInteger(maxSanity) || state.sanity < 0 || state.sanity > maxSanity) {
        throw new Error('Current Sanity must be valid before development.');
      }
      state.developmentJournal = { phase: 'new', record: {
        development_id: id, investigator_id: investigator, adventure_id: context.adventure_id,
        adventure_title: context.adventure_title, skill_id: skill.id, skill_name: skill.name,
        pre_value: pre, development_roll: null, development_success: null, improvement_roll: null,
        post_value: pre, experience_check_origin: context.adventure_id, resolved_at: null,
        mastery_triggered: false, sanity_reward_roll: null, sanity_reward_dice: null,
        sanity_before: state.sanity, sanity_after: state.sanity, sanity_maximum: maxSanity
      } };
    }
    const j = state.developmentJournal;
    const record = j.record;
    function persist() { write(copy(state)); }
    function rollOnce(label, sides, accept) {
      // A durable reservation precedes RNG. Failure after this point leaves a
      // pending record, never a license to generate a replacement result.
      j.phase = `${label}-pending`;
      persist();
      const rolls = sides.map(size => {
        const result = die(size);
        if (!Number.isInteger(result) || result < 1 || result > size) throw new Error('Invalid dice result.');
        return result;
      });
      accept(rolls);
      j.phase = `${label}-stored`;
      persist();
    }
    if (record.development_roll === null) rollOnce('d100', [100], ([roll]) => {
      record.development_roll = roll;
      record.development_success = roll > record.pre_value || roll >= 96;
    });
    if (record.development_success && record.improvement_roll === null) rollOnce('d10', [10], ([roll]) => {
      record.improvement_roll = roll;
      record.post_value = record.pre_value + roll;
    });
    record.mastery_triggered = record.development_success && record.pre_value < 90 && record.post_value >= 90 &&
      !own(state.masteryClaimed, skillId);
    if (record.mastery_triggered && record.sanity_reward_roll === null) rollOnce('sanity', [6, 6], rolls => {
      record.sanity_reward_dice = rolls;
      record.sanity_reward_roll = rolls[0] + rolls[1];
      record.sanity_after = Math.min(record.sanity_maximum, record.sanity_before + record.sanity_reward_roll);
    });
    const thresholds = math.thresholds(record.post_value);
    record.hard_value_after = thresholds.hard;
    record.extreme_value_after = thresholds.extreme;
    record.resolved_at = now();
    state.skillValues = { ...state.skillValues, [skillId]: record.post_value };
    state.skillChecks = (state.skillChecks || []).filter(id => id !== skillId);
    // Local consumption is adventure-scoped. An upstream snapshot may still
    // contain the earned check: the unique history identity always wins.
    state.developmentHistory = [...history(state), copy(record)];
    if (record.mastery_triggered) {
      state.masteryClaimed = { ...state.masteryClaimed, [skillId]: record.development_id };
      state.sanity = record.sanity_after;
    }
    state.developmentJournal = null;
    completeSummary(state, context, investigator, catalog, now);
    persist();
    return copy(record);
  }
  const api = Object.freeze({ eligible, view, resolve, identity, contextReady, completeSummary });
  if (typeof module !== 'undefined') module.exports = api;
  else root.RippersDevelopment = api;
})(typeof window === 'undefined' ? globalThis : window);
