# The Rippers — Player Character Dossier POC

This repository is a proof of concept for the player-facing character webpages for **The Rippers**.

The goal is not merely to reproduce a Call of Cthulhu character sheet in a browser. Each character gets an evolving dossier containing background, relationships, personal knowledge, released clues, mechanical reference, possessions, and later campaign updates.

## Prototype

The current non-canon test character is **Clara Whitcombe**, a commercial photographer.

After GitHub Pages is enabled, her dossier will be available at:

`https://findlerman09-lgtm.github.io/CoCplayertest/characters/clara-whitcombe/`

## Structure

```text
/
├── _config.yml
├── _layouts/
│   ├── default.html
│   └── character.html
├── assets/
│   └── rippers.css
├── characters/
│   └── clara-whitcombe.md
├── docs/
│   └── character-build-audit.md
└── index.md
```

New player characters should primarily require a new Markdown dossier file; the layout and styling remain shared.

## Spoiler-control rule

Never publish an unrevealed clue, Keeper secret, future NPC betrayal, hidden condition, or future character development into player-facing HTML, Markdown, YAML, JSON, JavaScript, CSS, comments, or public commit history.

A hidden browser element is not secret. Future material remains in Keeper/project files until it is actually released in play.

## Status

**Prototype only.** Clara Whitcombe and her example dossier updates are non-canon.
