# Between-adventure investigator development — PM handoff

Updated: 16 October 2026, following the user's persistence and scenario-UI clarification
Review branch: `codex/investigator-development`
PR: https://github.com/findlerman09-lgtm/CoCplayertest/pull/51
Disposition: **READY FOR PM QA — not merged or deployed.**

The user approved browser persistence and specified that upgrading investigators must unlock the second-scenario UI. That clarification supersedes the earlier restriction against unlocking that UI. The development engine still never marks an adventure complete, starts one, releases a handout, opens SEALED correspondence or writes Keeper/scenario mechanics. Separate bookkeeping controls record Keeper-confirmed completion and the start of the second adventure; UI availability reads the completed development receipt.

## Player / Keeper flow

1. During **Who is Jack?**, the player marks eligible skills as before. New marks automatically record that adventure as their origin; the rules for earning a mark are unchanged.
2. In **Adventure Progress**, confirm that the Keeper ended the adventure and this investigator participated. Older marks are listed and require a separate confirmation that they belong to this adventure. If that is incorrect, correct the marked skills with the Keeper before continuing. No existing mark is silently attributed.
3. Press **Finish Adventure (Keeper confirmed)**. Marks are frozen for that completed adventure. Investigator Development becomes available.
4. Resolve each checked skill deliberately. Every result and any mastery/SAN reward is saved. Once all eligible checks are resolved, the **How is Jack?** workspace becomes available automatically for that investigator. An adventure with no eligible checks completes and unlocks cleanly without dice.
5. **Open next scenario workspace** shows the upgraded investigator's existing sheet, correspondence, personal documents and shared-document tools. **Begin Scenario (Keeper confirmed)** is a separate action that starts attributing new marks to How is Jack?. Old marks remain resolved and values/history carry forward.

The completion confirmation is made in each investigator's browser profile, following the Keeper's instruction. There is no central account synchronization or new Keeper-authentication system; this follows the site's existing trusted-table, Keeper-confirmed control pattern. The unlock is per investigator, not a requirement that all five investigators finish together.

There was no second-scenario player workspace in the repository. This change adds its gated shell and links to existing tools. Scenario-specific scenes, text and handouts have not been invented or added. Existing release controls still decide when material can be opened.

## Files/components changed

| Files | Purpose |
| --- | --- |
| `assets/adventure-state.js` | Browser-local current adventure, Keeper-confirmed completion/participation, check origins, explicit legacy reconciliation, and second-workspace eligibility. |
| `assets/adventure-ui.js` | Completion confirmation, read-only context provider, workspace availability, and a distinct Keeper-confirmed scenario-start action. |
| `assets/development-engine.js` | Eligibility, unique event identity, durable dice journal, permanent skill values, mastery/SAN, immutable audit entries and completion receipts. |
| `assets/development-ui.js`, `assets/development.css` | Sequential development cards, result explanations, mastery/cap detail, archived summaries and responsive workspace controls. |
| `assets/skill-values.js` | Shared runtime Hard/Extreme calculation; integer floor division matches the original Liquid sheet convention. |
| `assets/character-state.js` | Schema 4; serialized writes, progression-safe resets/imports, adventure-scoped marks, permanent values in sheet/combat/language references. |
| `_includes/character-sheet.html`, `_includes/possessions-means.html` | Development and progress panels; current skill/language values. |
| `_includes/scenario-workspace.html`, five `characters/<slug>/scenario.md` files | Gated second-scenario workspace for the five canonical investigators. |
| `_layouts/base.html`, `_layouts/section.html` | Runtime components, hidden-until-earned navigation, workspace routing. |
| `_config.yml` | Excludes tests from the published site. |
| `tests/development.test.cjs`, `tests/adventure-state.test.cjs`, `tests/development-browser.cjs` | Engine, bookkeeping and real-controls browser QA. |
| `docs/state-storage-note.md`, this file | Current behavior, migration and QA evidence. |

No `_data` files or P-07 starting values changed. Clara Mercer remains the canonical reporter; her newspaper title remains held. No talents, Luck rules, scenario mechanics, Keeper content, handout/reveal scripts or existing release conditions changed. Whitcombe remains a non-canon fixture.

## Data, eligibility and persistence

The existing `rippers-character-state:<slug>` envelope advances to schema 4 and retains its data version. Added fields are:

- `skillValues`: current permanent skill overrides, leaving P-07 as the starting baseline.
- `developmentHistory`: append-only audit entries identified by `[investigator_id, adventure_id, skill_id]`.
- `developmentSummaries`: completion receipts, including no-check adventures.
- `masteryClaimed`: per-skill identity of the first awarded mastery event.
- `developmentJournal`: one unfinished resolution or `null`.
- `adventureProgress`: current adventure ID and each adventure's active/completed state, participation confirmation and timestamps.
- `experienceChecks`: adventure ID, skill ID, earned and resolved flags.
- `unattributedChecks`: older marks awaiting the user's explicit origin confirmation.

`RippersAdventureUI` supplies `RippersDevelopmentContext.read(investigatorId)` from that saved bookkeeping. Its projection contains only investigator ID, current adventure ID/title, completion/active status, participation and the complete scoped check list. Development rereads it under the write lock at action time. The engine accepts no completion/start/release writer. Unknown/unattributed checks and missing participation fail closed.

Each successful skill resolution clears its active mark and sets that specific adventure/check record to resolved. The next adventure can earn another mark for the same skill. All required audit fields are retained, plus the player-safe adventure title, individual mastery dice and SAN maximum at resolution. Failed improvement stores a null D10 and unchanged value; successful skill values can exceed 100.

All writes share the Web Lock `rippers-character-write:<slug>` and reread current storage while holding it. A durable pending reservation precedes each die stage; the generated D100, D10 and 2D6 results are stored before proceeding. Final skill values, mark clearing, SAN/mastery, history and completion receipt commit together in one atomic localStorage write. Duplicate event requests return their original record. Tabs cannot independently resolve the same event.

Stored-result interruptions resume with **Finish Recorded Development**. If execution/storage failed between a pending reservation and saving its result, the reservation blocks replacement dice and requires Keeper reconciliation. There is no automatic reroll. A pending journal also blocks unrelated tracker changes. Corrupt/unreadable storage is not replaced with defaults.

Mastery requires the first successful crossing from below 90 to at least 90 and an unclaimed skill flag. Its 2D6 reward is capped by the current normal SAN maximum, including Mythos. Subsequent above-90 improvements do not repeat the reward; starting values already at 90 do not trigger it. SAN gains do not reset insanity conditions or the loss period. A roll of +9 at SAN 95 with max 99 applies 4 and displays **5 points limited**.

The second workspace's availability derives from the first adventure's completed development receipt. That derived UI unlock writes no release keys and does not start the next adventure. A separate explicit start action advances the bookkeeping and begins with clean marks. The earned workspace remains available during later play/development.

## Migration and browser-persistence scope

Existing v1/v2/v3 state is read compatibly and written as schema 4 on mutation. Existing checkmarks stay unassigned until the player explicitly confirms their origin at completion. Newly marked checks receive the current adventure ID. Existing language IDs and the site's original earning controls are retained, including languages that have no check control. Reset retains adventure progress, experience marks, permanent increases, mastery and history while restoring current conditions. Legacy imports cannot roll back committed progress or resurrect processed marks; differing progression backups require Keeper reconciliation.

Browser persistence is the user's approved storage model. State survives refresh, back navigation, duplicate clicks, closing/reopening, and lock/sign-out/return in the same origin/profile. It does not synchronize devices or protect against explicit storage clearing/eviction, console edits, or an older deployed client overwriting data. Exports include the full state. Use one browser profile per investigator and refresh older open tabs when this version is eventually deployed. No shared backend is required or pending for this implementation.

## UI states

- **LOCKED:** active adventure, unconfirmed participation/origins or unavailable context; no roll action.
- **AVAILABLE:** completed-adventure heading, first eligible skill and deliberate roll action.
- **IN PROGRESS:** saved result cards followed by the next skill; second workspace remains locked.
- **COMPLETE:** immutable summary, updated values and mastery detail; second workspace link appears automatically after Adventure I. No eligible checks produces a persistent clean completion.
- **ARCHIVED:** prior development summaries stay viewable during the next adventure without reroll controls.
- **Second workspace:** direct navigation before the unlock shows a generic locked message without the second title. After unlock it shows How is Jack? and the existing dossier/document tools; scenario-specific content remains to be supplied through normal release work.

Desktop and 390px mobile layouts were inspected. The existing teal/gold dossier styling is retained.

## Acceptance results

**All twenty original checks pass, with test 20 updated for the user's explicit workspace-unlock instruction.** The integrated browser pass uses the actual new bookkeeping and controls, not an injected completion provider. The older fixture-provider pass is retained for isolated concurrency, offline, failure and mastery checks.

| # | Acceptance test | Result / evidence |
| --- | --- | --- |
| 1 | Locked during active adventure | PASS — engine and browser; no action. |
| 2 | Available after completion | PASS — real Keeper-confirmed completion feeds a read-only development projection; rolling never changes completion. |
| 3 | Only checked skills | PASS — unchecked skills absent and direct attempts rejected. |
| 4 | Exclusions | PASS — characteristics, Mythos, Credit Rating, Luck, SAN and talents rejected. |
| 5 | One D100 | PASS — repeat/reopen use original audit; browser reload/back retain count. |
| 6 | Above-skill success | PASS — above succeeds; equal fails. |
| 7 | 96–100 override | PASS — each value tested against a skill of 110. |
| 8 | One D10 | PASS — duplicate requests do not draw again. |
| 9 | Failure unchanged | PASS — skill unchanged; improvement die null; browser failure card verified. |
| 10 | Derived values | PASS — 76 gives Hard 38 / Extreme 15 on actual sheet and audit. |
| 11 | Check clears | PASS — resolved checkbox clears and queue updates. |
| 12 | Future adventure checks | PASS — same skill develops under a new adventure ID from its current value. |
| 13 | No duplicate resolution | PASS — simultaneous browser tabs queue the same event and create one record/two dice total. Offline resolution on a loaded page succeeds; reconnect/reload retains results. |
| 14 | Mastery threshold | PASS — 88 to 95 produces one stored 2D6 reward. |
| 15 | SAN maximum | PASS — Mythos-sensitive engine cap; browser 95 to 99 truncation verified. |
| 16 | Mastery once | PASS — later above-90 improvement adds no second reward. |
| 17 | Audit persists | PASS — reopen, lock/return, tracker reset and legacy import preserve history. |
| 18 | Adventure attribution | PASS — new marks record origin; old marks require explicit confirmation in the UI; audit retains origin. |
| 19 | Next adventure clean | PASS — increased values persist, old checks cleared, new empty case has no rolls. |
| 20 | Spoiler regression | PASS — the user-authorized second workspace unlocks after development; SEALED/reveal scripts, release keys and content remain unchanged. Unsafe context fields are not copied. |


**37 Node tests pass**, plus both browser modes. Additional coverage includes explicit legacy-origin confirmation, participation confirmation, partial development keeping the second workspace locked, automatic last-check and no-check unlock, direct-route gating, separate scenario start, fresh second-adventure origins, persistent baseline values, unchanged release keys, two-tab duplicate resolution, offline resolution on a loaded page, reset/import protection and mobile layout. Completed browser runs have no JavaScript exceptions. Syntax checks and `git diff --check` pass.

Browser validation used Chromium 153 and LiquidJS rendering of the real repository templates, registering the existing integer-division convention. A native Ruby/Jekyll production build remains a PM QA check: Ruby/Jekyll was unavailable and package installation was blocked by environment permissions. No release build or deployment is claimed.

Reproduce:

```sh
node --test tests/*.test.cjs
# QA environment: liquidjs, js-yaml, playwright and Chromium installed outside source.
NODE_PATH=/path/to/qa/node_modules node tests/development-browser.cjs
QA_REAL_ADVENTURE=1 NODE_PATH=/path/to/qa/node_modules node tests/development-browser.cjs
# Optional QA_CHROMIUM_PATH selects an existing Chromium binary.
```

QA fixtures and deterministic dice are excluded from the published site. No production adventure has been marked complete, no production release has been opened, and the draft has not been merged or deployed.

**BETWEEN-ADVENTURE LEVEL UP — READY FOR PM QA**
