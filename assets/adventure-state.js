(function (root) {
  'use strict';
  // Bookkeeping only. These titles do not grant access to scenario material.
  const first = 'who-is-jack';
  const second = 'how-is-jack';
  const titles = { [first]: 'Who is Jack?', [second]: 'How is Jack?' };
  const copy = value => JSON.parse(JSON.stringify(value));
  function ensure(input) {
    const state = copy(input);
    state.adventureProgress ||= { current: first, adventures: { [first]: { status: 'active', participated: false } } };
    state.experienceChecks ||= [];
    state.unattributedChecks ||= [];
    state.skillChecks ||= [];
    const current = state.adventureProgress.current;
    const attributable = new Set(state.experienceChecks.filter(check => check.adventure_id === current && check.earned && !check.resolved).map(check => check.skill_id));
    state.unattributedChecks = [...new Set([...state.unattributedChecks, ...state.skillChecks.filter(id => !attributable.has(id))])];
    return state;
  }
  function current(state) { return state.adventureProgress.adventures[state.adventureProgress.current]; }
  function mark(state, skillId, earned) {
    if (current(state).status !== 'active') throw new Error('Experience marks are closed during development. Begin the next adventure before earning new checks.');
    const adventure = state.adventureProgress.current;
    if (!earned) state.unattributedChecks = state.unattributedChecks.filter(id => id !== skillId);
    state.experienceChecks = state.experienceChecks.filter(check => !(check.adventure_id === adventure && check.skill_id === skillId && !check.resolved));
    if (earned && !state.unattributedChecks.includes(skillId)) state.experienceChecks.push({ adventure_id: adventure, skill_id: skillId, earned: true, resolved: false });
    state.skillChecks = [...new Set(earned ? [...state.skillChecks, skillId] : state.skillChecks.filter(id => id !== skillId))];
  }
  function finish(state, { participated, confirmedLegacy }, now = () => new Date().toISOString()) {
    if (state.developmentJournal) throw new Error('Finish the recorded development check first.');
    if (current(state).status !== 'active') return;
    if (participated !== true) throw new Error('Confirm that the Keeper ended this adventure and that this investigator participated.');
    if (JSON.stringify([...state.unattributedChecks].sort()) !== JSON.stringify([...(confirmedLegacy || [])].sort())) {
      throw new Error('Confirm the originating adventure of every older experience mark.');
    }
    const id = state.adventureProgress.current;
    for (const skillId of state.unattributedChecks) state.experienceChecks.push({ adventure_id: id, skill_id: skillId, earned: true, resolved: false });
    state.unattributedChecks = [];
    state.adventureProgress.adventures[id] = { status: 'completed', participated: true, completed_at: now() };
  }
  function context(state, investigator) {
    const progress = current(state);
    const id = state.adventureProgress.current;
    if (!titles[id] || !progress) return null;
    return { investigator_id: investigator, adventure_id: id, adventure_title: titles[id],
      status: progress.status, active_adventure: progress.status === 'active', participated: progress.participated,
      checks_complete: state.unattributedChecks.length === 0,
      checks: copy(state.experienceChecks.filter(check => check.adventure_id === id)) };
  }
  function secondAvailable(state, investigator) {
    const completed = state.adventureProgress.adventures[first];
    return completed?.status === 'completed' && completed.participated === true && state.developmentJournal?.record.adventure_id !== first &&
      (state.adventureProgress.current !== first || state.unattributedChecks.length === 0) &&
      (state.developmentSummaries || []).some(summary => summary.adventure_id === first && summary.investigator_id === investigator);
  }
  function startSecond(state, investigator, now = () => new Date().toISOString()) {
    if (!secondAvailable(state, investigator)) throw new Error('Complete investigator development before opening the next adventure.');
    if (state.adventureProgress.current === second) return;
    state.adventureProgress.current = second;
    state.adventureProgress.adventures[second] = { status: 'active', participated: false, started_at: now() };
    state.skillChecks = [];
  }
  const api = Object.freeze({ ensure, current, mark, finish, context, secondAvailable, startSecond, first, second, titles });
  if (typeof module !== 'undefined') module.exports = api;
  else root.RippersAdventureState = api;
})(typeof window === 'undefined' ? globalThis : window);
