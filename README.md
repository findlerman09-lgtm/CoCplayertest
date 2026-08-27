# The Rippers — Player Dossier Site

This repository is the player-facing dossier and archive surface for **The Rippers**.

Each investigator receives a private evolving dossier containing reveal-safe background, relationships, personal knowledge, released clues, mechanical reference, possessions, correspondence, and later campaign updates. Shared Documents and Case Files provide material released to the whole table.

## Current build status

**WEB-RC1 — Rehearsal synchronization.**

The completed website/static review is **S-08 preflight — PASS**. It is not final S-08. Final S-08 occurs only after the live timed rehearsal and the resulting bounded correction pass.

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

Final investigator identity and scenario art are consumed only from PM-controlled upstream character/art sources. Proof art, placeholder portraits, and website assets do not establish physical identity or story facts.

Unreleased reveal-gated scenario imagery is not committed to the player payload merely because the website can hide an element. The public repository remains a theatrical spoiler gate, not confidential storage.

## Access model

Investigator dossiers use campaign-issued passwords. Only salted PBKDF2 verifiers are stored in this public repository; plaintext dossier passwords are distributed separately.

The archive key and any sealed-document reveal codes are separate access layers. Existing **SEALED** document behavior must remain intact when controlled material is added or released.

## Player-material release model

RC1.1 handouts may be listed in Shared Documents as **SEALED** placeholders before their contents are earned. A sealed placeholder exposes only reveal-safe catalogue information; the handout body is encrypted and opens locally only after the Keeper supplies its code word. Unlock state persists only in that browser profile.

The release code controls the player artifact, not the underlying clue. Core facts remain available through the scenario's automatic and redundant clue routes even if a handout is never opened.

## Spoiler-control rule

Never publish an unrevealed clue, Keeper secret, future NPC betrayal, hidden condition, or future character development into player-facing HTML, Markdown, YAML, JSON, JavaScript, CSS, comments, or public commit history.

A hidden browser element is not secret. Future material remains in Keeper/project files until it is actually released in play.

## Development principle

This website is a downstream publication surface. Character, scenario, historical, mechanical, art, and production decisions are incorporated here after their controlling development or PM pass; the site must not invent campaign canon to fill unresolved fields.
