(function () {
  'use strict';
  const engine = window.RippersDevelopment;
  function el(tag, text, className) {
    const node = document.createElement(tag);
    if (text !== undefined) node.textContent = text;
    if (className) node.className = className;
    return node;
  }
  function recordCard(record) {
    const card = el('article', undefined, 'development-result');
    card.append(el('h3', `${record.skill_name} ${record.pre_value} → ${record.post_value}`));
    card.append(el('p', `Development Roll: ${record.development_roll}. ${record.development_success
      ? (record.development_roll > record.pre_value ? `${record.development_roll} exceeds ${record.pre_value}.` : '96–100 always succeeds.')
      : 'No improvement this time.'}`));
    if (record.development_success) card.append(el('p', `Improvement! Improvement Roll: ${record.improvement_roll}`));
    card.append(el('p', `Hard ${record.hard_value_after} · Extreme ${record.extreme_value_after}`));
    if (record.mastery_triggered) {
      card.append(el('h4', 'Mastery Achieved'));
      card.append(el('p', `Sanity Reward Roll: +${record.sanity_reward_roll} (${record.sanity_reward_dice.join(' + ')}). SAN ${record.sanity_before} → ${record.sanity_after}`));
      const limited = record.sanity_reward_roll - (record.sanity_after - record.sanity_before);
      if (limited) card.append(el('p', `${limited} points limited by maximum Sanity.`));
    }
    card.append(el('small', `Experience earned during ${record.adventure_title} · ${record.resolved_at}`));
    return card;
  }
  function mount(store) {
    const panel = store.root.querySelector('[data-development]');
    if (!panel) return;
    const catalog = [...store.root.querySelectorAll('[data-skill-check]')].map(input => ({
      id: input.dataset.skillCheck, name: input.dataset.skillName, value: Number(input.dataset.skillValue),
      kind: 'skill', improvable: !input.disabled
    }));
    const content = panel.querySelector('[data-development-content]');
    const status = panel.querySelector('[data-development-status]');
    const notice = panel.querySelector('[data-development-notice]');
    const archive = panel.querySelector('[data-development-history]');
    let rendering = 0;
    let busy = false;
    // Deliberately no fallback to release keys, case_files.status, dates or
    // manually selected adventures. An upstream read-only adapter is required.
    async function readContext() {
      const provider = window.RippersDevelopmentContext;
      return provider && typeof provider.read === 'function' ? provider.read(store.slug) : null;
    }
    async function render() {
      const sequence = ++rendering;
      let context = null;
      try { context = await readContext(); } catch { /* fail closed */ }
      if (sequence !== rendering) return;
      const state = store.read();
      const view = engine.view(state, context, store.slug, catalog);
      if (view.status === 'COMPLETE' && navigator.locks) {
        try {
          await navigator.locks.request(store.lockName, async () => {
            const fresh = store.read();
            const freshContext = await readContext();
            if (engine.completeSummary(fresh, freshContext, store.slug, catalog, () => new Date().toISOString())) store.write(fresh);
          });
        } catch { notice.textContent = 'The completion summary could not be saved. Please reopen development when storage is available.'; }
        if (sequence !== rendering) return;
      }
      content.replaceChildren();
      archive.replaceChildren();
      status.textContent = view.status;
      if (view.status === 'LOCKED') {
        content.append(el('p', context?.status === 'active' || context?.active_adventure === true
          ? 'Development is locked while an adventure is active.'
          : 'Development is unavailable until adventure completion, participation and experience-check history are confirmed.'));
      } else {
        content.append(el('h2', `${view.status === 'COMPLETE' ? 'Development Complete —' : 'Development following'} ${context.adventure_title}`));
        view.records.forEach(record => content.append(recordCard(record)));
        if (view.status === 'COMPLETE' && !view.records.length) {
          content.append(el('p', `No eligible experience checks were earned during ${context.adventure_title}.`));
        }
        if (view.remaining.length) {
          const pendingId = state.developmentJournal?.record.skill_id;
          const skill = view.remaining.find(item => item.id === pendingId) || view.remaining[0];
          const current = state.skillValues?.[skill.id] ?? skill.value;
          const card = el('article', undefined, 'development-card');
          card.append(el('small', `${view.remaining.length} checked skill${view.remaining.length === 1 ? '' : 's'} remaining`));
          card.append(el('h3', `${skill.name} — ${current}%`));
          card.append(el('p', `Experience earned during ${context.adventure_title}.`));
          if (!navigator.locks || !window.crypto?.getRandomValues) {
            card.append(el('p', 'This browser cannot safely save development rolls. Use a browser with secure storage coordination.'));
          } else if (state.developmentJournal?.phase.endsWith('-pending')) {
            card.append(el('p', 'An interrupted roll requires Keeper review. No replacement roll is available.'));
          } else {
            const button = el('button', state.developmentJournal ? 'Finish Recorded Development' : 'Make Development Roll', 'small-action');
            button.type = 'button';
            button.disabled = busy;
            button.addEventListener('click', async () => {
              if (busy) return;
              busy = true;
              button.disabled = true;
              notice.textContent = 'Recording development…';
              try {
                await navigator.locks.request(store.lockName, async () => {
                  const freshContext = await readContext();
                  // Recheck the exact adventure at action time. Never silently
                  // resolve a different adventure after an upstream transition.
                  if (freshContext?.adventure_id !== context.adventure_id) throw new Error('Adventure state changed. Review the updated development status.');
                  engine.resolve({ ...store, context: freshContext, investigator: store.slug, skillId: skill.id,
                    catalog, maxSanity: store.maxSanity(store.read()) });
                });
                notice.textContent = 'Development recorded. The result is permanent.';
              } catch (error) {
                notice.textContent = error.message || 'Development could not be saved. No replacement roll is available.';
              } finally {
                busy = false;
                store.refresh();
                await render();
              }
            });
            card.append(button);
          }
          content.append(card);
        }
      }
      const emptySummaries = (state.developmentSummaries || []).filter(item => item.no_eligible_checks &&
        (view.status === 'LOCKED' || item.adventure_id !== context.adventure_id));
      if (view.archived.length || emptySummaries.length) {
        const details = el('details');
        details.append(el('summary', 'Prior Development Summaries — Archived'));
        const groups = new Map();
        view.archived.forEach(record => {
          if (!groups.has(record.adventure_id)) groups.set(record.adventure_id, []);
          groups.get(record.adventure_id).push(record);
        });
        groups.forEach(records => {
          details.append(el('h3', records[0].adventure_title));
          records.forEach(record => details.append(recordCard(record)));
        });
        emptySummaries.forEach(summary => {
          details.append(el('h3', `Development Complete — ${summary.adventure_title}`));
          details.append(el('p', `No eligible experience checks were earned during ${summary.adventure_title}.`));
        });
        archive.append(details);
      }
    }
    window.addEventListener('rippers:state-change', event => { if (event.detail?.slug === store.slug) render(); });
    window.addEventListener('rippers:development-context-change', render);
    render();
  }
  window.RippersDevelopmentUI = Object.freeze({ mount });
})();
