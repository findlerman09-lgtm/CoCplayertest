# Pass 2.1 — Singular Dossier and Private Effects

## Investigator access

The player-facing major section is **Investigator** (singular).

Before any later Team View reveal, the Investigator section contains only the private dossier password gate. It never displays empty roster slots, other investigator identities, or a count of player characters.

A successful personal password routes directly to the matching dossier and remembered access may route the player back to that dossier automatically.

`team_view` remains a reserved campaign-state concept, but any future Team View should be a separate shared surface rather than replacing the personal Investigator gate.

## Private condition effects

The Character Sheet continues to apply the ordinary rules-aware thresholds for HP and SAN. It does not roll attacks, SAN checks, INT checks, CON checks, or improvement checks.

When a Major Wound is created, the player's browser privately draws a wound description and stores it locally. The description supplies injury/scar fiction only. It does **not** add a new mechanical penalty beyond the Major Wound rules. If the generated wording conflicts with the attack that caused the wound, the wording is adapted to the established fiction.

Each wound entry can be resolved individually. Resolving one wound removes only that private wound description. If the final wound is resolved, the mechanical Major Wound marker is cleared as well. Manually clearing the Major Wound marker clears any remaining wound descriptions so the mechanical and narrative state cannot drift apart.

When temporary or indefinite insanity begins, or an already-insane investigator loses further SAN and therefore suffers another bout, the player's browser privately draws a rules-compatible bout category and a d10 duration result. Phobia/compulsion results also receive a private specific prompt. The player sees this before the Keeper and brings it into play; the Keeper retains authority to adapt the exact scene outcome.

Each bout can be ended individually without automatically clearing an underlying temporary or indefinite insanity condition. Using **Clear insanity condition** clears the active temporary/indefinite condition and removes the remaining bout entries tied to that condition. SAN totals and the current SAN-loss period are not restored by that action.

Private effects are stored under a character-specific browser key and are not published back to GitHub. Resetting the local tracker clears the private-effect history along with the local condition state.

This is intentionally a game device rather than a model of real-world psychiatric diagnosis or physical trauma.
