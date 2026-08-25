# The Rippers — Player Dossier Site

This repository is the player-facing dossier and archive surface for **The Rippers**.

Each investigator receives a private evolving dossier containing reveal-safe background, relationships, personal knowledge, released clues, mechanical reference, possessions, correspondence, and later campaign updates. Shared Documents and Case Files provide material released to the whole table.

## Current investigator roster

The player-facing Investigator gate is configured for the five current campaign investigators:

- Arthur Bell
- Thomas Merrick
- Miriam Hart
- Clara Mercer — current development identity pending final name/collision approval
- Laurence Kersey

The earlier **Clara Whitcombe** photographer dossier remains in the repository strictly as a non-canon development and mechanical-regression reference. It is not part of the player-facing Investigator cabinet.

## Mechanical status

The five campaign investigators are intentionally staged with their narrative dossiers ahead of final mechanics. Their live character-state fields remain disabled until the P-07 rules/balance/equipment pass supplies approved values.

Clara Whitcombe retains completed prototype mechanics because her purpose is to exercise and regression-test the character-state interface.

## Access model

Investigator dossiers use campaign-issued passwords. Only salted PBKDF2 verifiers are stored in this public repository; plaintext dossier passwords are distributed separately.

The archive key and any sealed-document reveal codes are separate access layers.

## Spoiler-control rule

Never publish an unrevealed clue, Keeper secret, future NPC betrayal, hidden condition, or future character development into player-facing HTML, Markdown, YAML, JSON, JavaScript, CSS, comments, or public commit history.

A hidden browser element is not secret. Future material remains in Keeper/project files until it is actually released in play.

## Development principle

This website is a downstream publication surface. Character, scenario, historical, and mechanical decisions are incorporated here after their controlling development or PM pass; the site should not invent campaign canon to fill unresolved fields.
