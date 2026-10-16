(function () {
  'use strict';
  const model = window.RippersAdventureState;
  function node(tag, text) { const element = document.createElement(tag); element.textContent = text; return element; }
  function mount(store) {
    const controls = store.root.querySelector('[data-adventure-controls]');
    const workspace = store.root.querySelector('[data-scenario-workspace]');
    const nextLinks = [...document.querySelectorAll('[data-next-scenario-link]')];
    let busy = false;
    // This local provider reads completion/participation/check origins. The
    // development module receives no completion or scenario-start writer.
    window.RippersDevelopmentContext ||= Object.freeze({
      read: investigator => investigator === store.slug ? model.context(store.read(), investigator) : null
    });
    async function mutate(action, notice) {
      if (busy) return;
      if (!navigator.locks) { notice.textContent = 'Use a browser that supports safe coordination of saved character state.'; return; }
      busy = true;
      try {
        await navigator.locks.request(store.lockName, () => {
          const state = store.read();
          action(state);
          store.write(state);
        });
        store.refresh();
        window.dispatchEvent(new Event('rippers:development-context-change'));
      } catch (error) { notice.textContent = error.message; }
      finally { busy = false; }
    }
    function render() {
      const state = store.read();
      const available = model.secondAvailable(state, store.slug);
      const adventure = model.current(state);
      nextLinks.forEach(link => { link.hidden = !available; });
      if (controls) {
        controls.replaceChildren();
        controls.append(node('h2', model.titles[state.adventureProgress.current]));
        if (adventure.status === 'active') {
          controls.append(node('p', 'Mark eligible skill uses as usual. Their adventure is recorded automatically. When the Keeper ends the adventure, confirm below to open investigator development.'));
          const confirm = document.createElement('input'); confirm.type = 'checkbox'; confirm.dataset.confirmAdventure = '';
          const label = node('label', ' The Keeper has ended this adventure, and my investigator participated.'); label.prepend(confirm); controls.append(label);
          let legacyConfirm;
          if (state.unattributedChecks.length) {
            const names = state.unattributedChecks.map(id => [...store.root.querySelectorAll('[data-skill-check]')].find(input => input.dataset.skillCheck === id)?.dataset.skillName || id);
            controls.append(node('p', `Older marks need confirmation: ${names.join(', ')}.`));
            legacyConfirm = document.createElement('input'); legacyConfirm.type = 'checkbox'; legacyConfirm.dataset.confirmLegacyChecks = '';
            const legacyLabel = node('label', ` These older marks were earned during ${model.titles[state.adventureProgress.current]}.`);
            legacyLabel.prepend(legacyConfirm); controls.append(legacyLabel);
            controls.append(node('small', 'If that is incorrect, correct the marked skills with the Keeper before continuing. No older mark has been assigned automatically.'));
          }
          const button = node('button', 'Finish Adventure (Keeper confirmed)'); button.type = 'button'; button.className = 'small-action'; button.disabled = true;
          const notice = node('p', ''); notice.setAttribute('role', 'status');
          const enabled = () => { button.disabled = !confirm.checked || (legacyConfirm && !legacyConfirm.checked); };
          confirm.addEventListener('change', enabled); legacyConfirm?.addEventListener('change', enabled);
          button.addEventListener('click', () => {
            button.disabled = true;
            const expected = state.adventureProgress.current;
            mutate(fresh => {
              if (fresh.adventureProgress.current !== expected) throw new Error('The current adventure changed. Review it before continuing.');
              model.finish(fresh, { participated: confirm.checked, confirmedLegacy: legacyConfirm?.checked ? state.unattributedChecks : [] });
            }, notice).finally(enabled);
          });
          controls.append(button, notice);
        } else {
          const complete = (state.developmentSummaries || []).some(summary => summary.investigator_id === store.slug && summary.adventure_id === state.adventureProgress.current);
          controls.append(node('p', complete
            ? (state.adventureProgress.current === model.first ? 'Development complete. The next scenario workspace is now available.' : 'Development complete. Your updated investigator is saved.')
            : 'Adventure complete. Resolve the checked skills in Investigator Development below.'));
        }
      }
      if (workspace) {
        workspace.replaceChildren();
        if (!available) {
          workspace.append(node('h2', 'Scenario workspace locked'));
          workspace.append(node('p', 'Finish the current adventure and complete investigator development to open the next scenario workspace.'));
          return;
        }
        workspace.append(node('h2', model.titles[model.second]));
        workspace.append(node('p', 'Your updated investigator is ready. Permanent skills, current condition and development history carry forward. The Keeper releases each handout and correspondence item through the existing controls.'));
        if (state.adventureProgress.current === model.first) {
          const button = node('button', 'Begin Scenario (Keeper confirmed)'); button.type = 'button'; button.className = 'small-action';
          const notice = node('p', ''); notice.setAttribute('role', 'status');
          button.addEventListener('click', () => {
            if (!window.confirm('Has the Keeper begun How is Jack? New skill checks will belong to that adventure.')) return;
            button.disabled = true;
            mutate(fresh => model.startSecond(fresh, store.slug), notice).finally(() => { button.disabled = false; });
          });
          workspace.append(button, notice);
        } else workspace.append(node('p', adventure.status === 'active' ? 'Adventure active. New experience checks belong to this adventure.' : 'Adventure complete. Return to your character sheet for development.'));
        const links = document.querySelector('[data-scenario-tools]');
        if (links) workspace.append(links.content.cloneNode(true));
      }
    }
    window.addEventListener('rippers:state-change', event => { if (event.detail?.slug === store.slug) render(); });
    render();
  }
  window.RippersAdventureUI = Object.freeze({ mount });
})();
