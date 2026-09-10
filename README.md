# The Rippers — Player Dossier Site

This repository is the player-facing dossier and archive surface for **The Rippers**.

Each investigator receives a private evolving dossier containing reveal-safe background, relationships, personal knowledge, released clues, mechanical reference, possessions, correspondence, and later campaign updates. Shared Documents and Case Files provide material released to the whole table.

## Current build status

**WEB-RC1 — P11 approved-asset integration and final website QA.**

The site uses the frozen `WHO_IS_JACK_RC1.2.1_REHEARSAL_EDITION` campaign state. Implementation changes remain on a review branch until PM approval.

Implementation QA is recorded in [`docs/WEB_FINAL_QA_2026-09-10.md`](docs/WEB_FINAL_QA_2026-09-10.md).

This repository is a downstream implementation surface. It does **not** create or supersede campaign canon.

## Current investigator roster

The player-facing Investigator gate is configured for the five current campaign investigators:

- Arthur Bell
- Thomas Merrick
- Miriam Hart
- Clara Mercer — locked East-End reporter identity; fictional newspaper title remains held
- Laurence Kersey

The earlier **Clara Whitcombe** photographer dossier remains in the repository strictly as a non-canon development and mechanical-regression reference. It is not part of the player-facing Investigator cabinet.

## Mechanical status

The five live investigators use the PM-approved P-07 mechanical ensemble and the selected Gaslight/Pulp house hybrid. Their browser tracker state is versioned independently from campaign canon so stored play state can survive controlled data migrations.

Clara Whitcombe retains prototype mechanics only because her purpose is regression testing outside the live five-investigator cabinet.

## Visual-control boundary

Final investigator identity and scenario art are consumed only from PM-approved P11 derivatives. Proof art and placeholders do not establish physical identity or story facts.

The site is for a trusted tabletop group. Its release controls prevent accidental spoilers during ordinary navigation; they are not security controls, and the repository must not be treated as confidential storage.

## Access model

The existing archive and investigator-dossier access gates remain separate from player-material releases. The H1–H5 handouts and staged visuals use simple Keeper-directed release controls with browser-local persistence; they do not use passwords or encryption.

## Player-material release model

H1–H5 may be listed in Shared Documents as **SEALED** placeholders before their contents are earned. When the Keeper releases one, the player uses its release control to file the approved artifact and accessible transcript. Release state persists only in that browser profile.

NPC portraits and Penfold scenes use scene-release controls. Surgeon `003B`, Surgeon `003C`, and `A1-ART-005` are post-direct-reveal material. `A1-ART-005` remains unavailable until a direct Surgeon visual has first been filed.

The release control files the player artifact; it does not gate the underlying clue. Core facts remain available through the scenario's automatic and redundant clue routes even if a handout is never opened.

## Spoiler-control rule

Keeper-only maps, Surgeon `003A`, and Surgeon `003D`–`003F` do not belong in player navigation or player-site assets. Staged player visuals are loaded only after their release control is used. A hidden browser element is not secret; this separation is for ordinary table use, not adversarial access.

## Development principle

This website is a downstream publication surface. Character, scenario, historical, mechanical, art, and production decisions are incorporated here after their controlling development or PM pass; the site must not invent campaign canon to fill unresolved fields.
