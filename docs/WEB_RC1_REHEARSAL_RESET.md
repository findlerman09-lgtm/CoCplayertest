# WEB-RC1 Rehearsal Reset / Preflight

Status: rehearsal utility instructions. This is not a player feature and contains no passwords or scenario answers.

The live site loads a small `RippersRehearsalTools` helper object for device/profile preparation. It has no visible controls.

## Audit a browser profile

Open the browser developer console on any Player Archive page and run:

```js
RippersRehearsalTools.audit()
```

The result reports only local state counts:

- archive authorization present or absent;
- number of remembered dossier authorizations;
- number of opened release records;
- number of saved tracker states;
- number of private-effect states;
- whether a last-used dossier is remembered.

## Reset access/release state without touching character trackers

Run:

```js
RippersRehearsalTools.resetReleaseAndAccessState()
```

This removes only:

- archive authorization;
- remembered dossier authorization;
- last-used dossier routing;
- all sealed-record unlock keys, titles, timestamps, and local known-person/location memories;
- the pending archive return path in session storage.

It deliberately preserves:

- HP/SAN/Luck/Mythos state;
- improvement checks;
- Major Wound and insanity state;
- private effects / narrative wound notes.

The helper refuses a request to erase trackers. Deliberate character-state resets must still use the in-dossier Keeper/player controls.

After a reset, reload the site and begin the profile as a clean access/release rehearsal state.

## Six-profile rehearsal setup

Prepare:

1. five clean player browser profiles/containers;
2. one separate Keeper device/profile;
3. the current Keeper credential workbook outside the public repository.

For each player profile verify:

- archive begins closed after reset;
- only the assigned dossier is opened with its issued dossier password;
- shared records begin sealed;
- wrong release code fails without changing state;
- correct release code opens only the intended record;
- refresh retains that profile's opened record;
- another clean profile remains sealed;
- local known-person/location filing grows only from opened records;
- print omits still-sealed material.

For the Keeper device verify:

- no player dossier state is accidentally shared from another browser profile;
- the Keeper credential workbook remains separate from the public site;
- staged release behavior follows the current RC1.1 Keeper release plan.

## Feature-freeze rule

Once this reset/preflight is in place, do not add new player-site features before rehearsal unless an upstream asset requires a prepared slot or a demonstrated defect needs correction.
