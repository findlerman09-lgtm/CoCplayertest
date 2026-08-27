/* WEB-RC1 rehearsal helpers. No UI is exposed and no campaign content or passwords live here.
   Use from the browser console on a rehearsal profile when directed by the Keeper checklist. */
(function () {
  function keysMatching(predicate) {
    return Object.keys(localStorage).filter(predicate);
  }

  function audit() {
    const releaseKeys = keysMatching(key => /^rippers-unlock-/.test(key) && !/^rippers-unlock-(title|time|memory)-/.test(key));
    const dossierKeys = keysMatching(key => key.startsWith('rippers-dossier-access:'));
    const trackerKeys = keysMatching(key => key.startsWith('rippers-character-state:'));
    const privateEffectKeys = keysMatching(key => key.startsWith('rippers-private-effects:'));
    const archiveAccess = Boolean(localStorage.getItem('rippers-archive-access'));

    return Object.freeze({
      archiveAccess,
      dossierAccessCount: dossierKeys.length,
      openedReleaseCount: releaseKeys.length,
      trackerStateCount: trackerKeys.length,
      privateEffectStateCount: privateEffectKeys.length,
      lastDossierRemembered: Boolean(localStorage.getItem('rippers-last-dossier'))
    });
  }

  function resetReleaseAndAccessState(options = {}) {
    const preserveTrackers = options.preserveTrackers !== false;
    if (!preserveTrackers) {
      throw new Error('WEB-RC1 rehearsal reset intentionally refuses to erase tracker/private-effect state. Use the in-dossier reset controls for a deliberate character-state reset.');
    }

    const removed = [];
    const removable = key => (
      key === 'rippers-archive-access' ||
      key === 'rippers-last-dossier' ||
      key.startsWith('rippers-dossier-access:') ||
      key.startsWith('rippers-unlock-')
    );

    Object.keys(localStorage).filter(removable).forEach(key => {
      removed.push(key);
      localStorage.removeItem(key);
    });
    sessionStorage.removeItem('rippers-archive-return');

    window.dispatchEvent(new CustomEvent('rippers:rehearsal-reset'));
    return Object.freeze({ removedCount: removed.length, removed, preserved: audit() });
  }

  window.RippersRehearsalTools = Object.freeze({ audit, resetReleaseAndAccessState });
})();
