# Player-side state storage

The static GitHub Pages site stores transient play state in the player's browser via `localStorage`.

Stored locally per investigator:

- current HP;
- current SAN;
- current Luck;
- Major Wound marker;
- skill-use improvement checkmarks;
- successful dossier unlock state.

This is intentionally lightweight for a three-scenario campaign. Permanent character changes, including resolved skill increases between scenarios, remain canonical in the repository and should be published back to the character data after the Keeper resolves development.

Because this is browser-local state, it does not automatically follow the player to another device. Export/import or cross-device synchronization can be considered later only if playtesting shows it is needed.
