# Player-site playtest remediation — 26 August 2026

Status: implementation branch acceptance record.

This record documents site-layer corrections made from the 26 August playtest audit. It does not establish scenario canon or publish Keeper-only mechanics.

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

Keeper-only Vale, pursuit, Clockwork Surgeon, Cadosch, and SAN mechanics are controlled outside the public player repository and must not be copied into player-facing site data.
