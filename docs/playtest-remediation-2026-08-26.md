# Player-site playtest remediation — 26 August 2026

Status: **historical implementation record; superseded for current status by the RC1 website synchronization record.**

This record documents site-layer corrections made from the 26 August playtest audit. It does not establish scenario canon, does not represent the final post-rehearsal acceptance gate, and does not publish unreleased campaign material.

## Acceptance targets

- Locked investigator dossiers remain hidden in print and print preview.
- Clara Mercer is the locked reporter identity; the fictional newspaper title remains held.
- Clara Whitcombe remains non-canon regression material and outside the five-investigator cabinet.
- The shared archive uses Adventure I player handouts rather than demonstration case material.
- Dossier keys normalize case and surrounding whitespace.
- Multiple remembered dossiers do not silently select the first investigator.
- Archive and dossier authorization can be cleared on shared devices without erasing campaign tracker state.
- A pending temporary-insanity INT check cannot be silently replaced by later SAN loss.
- Removing a narrative wound note cannot clear mechanical Major Wound status.
- Saved tracker state carries explicit schema/data-version handling and migrates the previous flat state.
- Maximum SAN reflects Cthulhu Mythos when recorded.
- Destructive or Keeper-timed tracker actions require deliberate confirmation.
- Gate and tracker status messages are announced accessibly and a no-JavaScript fallback is visible.

## Out of scope

Unreleased Keeper-only scenario mechanics and antagonist material are controlled outside the public player repository and must not be copied into player-facing site data.
