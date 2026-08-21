# Pass 2 — Multi-Level Player Experience

## Scope

Pass 2 deepens the investigator experience without expanding into the document system, scenario archive, or final visual-asset pass.

Locked access flow entering this pass:

1. The public splash is opened with the archive key.
2. The Investigators tab presents one private-dossier password gate, not a roster.
3. A successful personal password routes directly to that investigator's Overview.
4. The device remembers that investigator's access until the player chooses Lock Dossier.
5. Team View remains Keeper-controlled and disabled until a later campaign milestone.

## Character hierarchy

Each investigator dossier contains:

- Overview — identity, background, roleplay anchor, competence spotlight, unique access, personal pressure, and key relationships.
- Character Sheet — current condition, characteristics, skills, combat reference, talent, and improvement marks.
- People — the investigator's ordinary social world and relationships.
- Correspondence — private letters and code-word releases.
- Documents — material received, created, or uniquely interpreted by that investigator.
- Possessions — gear and financial means.

The design tests two questions independently:

- Can the player understand who this person is without looking at numbers?
- Can the player find the number or condition they need at the table within a few seconds?

## Rules-aware condition tracker

The website never rolls dice. It records events, applies deterministic thresholds, and tells the player which roll or rule follows.

### Damage

Damage entered in the one-attack field is treated as a single damaging event.

- Damage at least half maximum HP marks a Major Wound and prompts the CON roll to remain conscious.
- Reaching 0 HP without a Major Wound is shown as unconscious.
- Reaching 0 HP with a Major Wound is shown as dying.
- One attack dealing at least maximum HP is shown as fatal.
- Manual HP +/- controls remain available for healing and correction and do not pretend to reconstruct an attack event.

### Sanity

SAN entered in the one-event field is treated as loss from one event.

- Loss of 5 or more SAN from one event prompts the required INT roll. The player records whether the INT roll succeeded or failed; the site does not roll it.
- An INT success marks temporary insanity. An INT failure records no temporary insanity from that one-time loss.
- Cumulative SAN loss is tracked against one fifth of SAN at the start of the current Keeper-defined SAN-loss period. Reaching that threshold marks indefinite insanity.
- SAN reaching 0 is shown as permanent insanity.
- Starting a new SAN-loss period resets only the cumulative one-fifth counter; it does not clear an existing temporary or indefinite insanity condition.
- Clearing an insanity condition is a separate Keeper/player action and never restores SAN automatically.

## Development marks

Qualifying skill-use marks remain browser-local during play. Marked skills collect in the Improvement Queue. Between scenarios, the table resolves improvement rolls normally and the permanent revised skill values are then committed to the canonical character data.

## Validation investigator

`_data/validation_investigator.yml` is deliberately non-canon and never appears in player navigation. It exists only to stress-test the dossier model against a character very unlike Clara: lower social status, physical/river competence, sparse equipment, and different relationship/access patterns.

## Deferred

Pass 3 owns reusable handout/document rendering and polished code-word reveal components.

Pass 4 owns scenario/file continuity.

Pass 5 owns final visual assets, typography, texture, ornament, animation refinement, responsive polish, and print polish.
