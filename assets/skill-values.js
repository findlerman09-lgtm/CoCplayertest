(function (root) {
  'use strict';
  // Matches the sheet's integer Liquid divided_by convention. Both the live
  // sheet and development history use this one runtime implementation.
  const api = Object.freeze({
    thresholds(value) {
      if (!Number.isSafeInteger(value) || value < 0) throw new Error('Invalid skill value.');
      return { hard: Math.floor(value / 2), extreme: Math.floor(value / 5) };
    }
  });
  if (typeof module !== 'undefined') module.exports = api;
  else root.RippersSkillValues = api;
})(typeof window === 'undefined' ? globalThis : window);
