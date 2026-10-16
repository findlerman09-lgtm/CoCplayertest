# Between-adventure investigator development — PM handoff

Date: 16 October 2026  
Base reviewed: `defe3ecef314294cd52442fadb35656d5a7a7707`  
Review branch: `codex/investigator-development`  
Disposition: **HOLD — integration dependencies remain; do not merge or deploy.**

The requested development engine, sequential player interface, persistent results and sheet integration are implemented for review. The production site intentionally exposes no roll action without a valid upstream context. This is not a claim that the live campaign workflow is ready.

## Dependencies requiring PM decision

1. **Completion and participation source is absent.** `_data/case_files.yml` has a player archive entry with `status: open`; it does not establish an identified completed adventure or investigator participation. `_data/site_state.yml` records website production status, not adventure completion. Neither has been reinterpreted. PM must identify/provide the authoritative read-only source, or authorize a separately scoped upstream implementation.
2. **Existing experience marks have no adventure origin.** `character-state.js` stores `skillChecks: [skillId, ...]`. No date, release key, current case label or filename can safely assign those marks to an adventure. PM/Keeper must reconcile existing marks and supply their real origin. This change does not alter which uses earn checks or silently migrate them to Adventure I.
3. **Persistence is browser-local.** The existing site has no account-backed character store. This implementation enforces uniqueness and preserves results within the same origin/browser profile, including concurrent tabs and sign-out/return. It does not establish cross-device uniqueness, remote backup, or protection against deliberate storage clearing, eviction, console edits, or an older deployed client overwriting the tracker. PM must approve this bounded storage model or authorize a durable shared store before activation. Existing repository guidance treated permanent advancement as a Keeper-published data update; that publication/reconciliation policy must be settled too. P-07 files were not overwritten.

## Changes

| Files | Purpose |
| --- | --- |
| `assets/development-engine.js` | Eligibility, per-event identity, durable dice journal, permanent values, mastery, audit entries and completion summaries. No adventure/release writes. |
| `assets/skill-values.js` | Shared runtime Hard/Extreme calculation using floor division, matching the existing sheet's Liquid integer division. |
| `assets/development-ui.js`, `assets/development.css` | Sequential skill cards, result explanations, mastery/cap display, completion and archived summaries, responsive styling. |
| `assets/character-state.js` | Schema 3; serialized tracker writes, permanent skill rendering, progression-preserving reset/import, storage refresh, fail-closed corrupt-storage handling. |
| `_includes/character-sheet.html` | Development panel and live skill, threshold, combat and language references. Existing controls remain. |
| `_includes/possessions-means.html` | Own-language values reflect saved development. |
| `_layouts/base.html` | Load the new runtime/style components before the existing tracker. |
| `_config.yml` | Exclude QA fixtures from the published site. |
| `tests/development.test.cjs`, `tests/development-browser.cjs` | Rule/persistence checks and browser tests using actual sheet/base templates with explicitly fictional upstream fixtures. |
| `docs/state-storage-note.md`, this handoff | Storage behavior, activation dependencies, test results and migration instructions. |

No `_data` files, investigator identities, starting builds, talents, Luck rules, scenario/reveal scripts, Keeper content or release conditions changed. Clara Mercer remains the canonical reporter; the newspaper title remains held. The non-canon Whitcombe fixture is not promoted into the live roster.

## Read-only upstream contract

The production bundle does **not** install this provider. Its owner must expose:

```js
window.RippersDevelopmentContext = {
  async read(investigatorId) {
    // Read the authoritative source; return only the allowed projection below.
    // Return null when completion/participation/origins cannot be established.
  }
};
```

The return value must have this shape (values below are QA examples, not canon):

```json
{
  "investigator_id": "arthur-bell",
  "adventure_id": "qa-case-one",
  "adventure_title": "QA Completed Case",
  "status": "completed",
  "active_adventure": false,
  "participated": true,
  "checks_complete": true,
  "checks": [
    { "adventure_id": "qa-case-one", "skill_id": "spot-hidden", "earned": true, "resolved": false }
  ]
}
```

`checks_complete` certifies that this is the complete check inventory, not a partial fetch. A missing/malformed projection, an active adventure, a nonparticipant, or an unmapped earned check fails closed. An authoritative empty list yields a persisted no-check completion summary. A current adventure title must already be player-safe; the adapter must never supply a hidden/next-adventure title. IDs use lowercase letters, digits and hyphens.

The feature rereads context under the exclusive write lock at action time and refuses an unexpected adventure switch. Its only output is the existing character-state envelope. It never calls an upstream writer, marks an adventure complete, or releases material. The adapter may notify a changed projection with `rippers:development-context-change`. Do not ship the QA adapter as the live source.

## Schema, persistence and recovery

The existing `rippers-character-state:<slug>` key and `dataVersion` remain. The envelope advances to `schemaVersion: 3`, adding:

- `skillValues`: current permanent skill overrides; P-07 remains the starting baseline.
- `developmentHistory`: append-only resolved audit records keyed by the JSON tuple `[investigator_id, adventure_id, skill_id]`.
- `developmentSummaries`: completed-adventure receipts, including zero-check completion.
- `masteryClaimed`: per-skill identity of the first paid mastery event.
- `developmentJournal`: at most one unfinished event, or `null`.

Every audit record retains all requested fields plus the player-safe adventure title, individual mastery dice and SAN maximum at resolution. Failure stores `improvement_roll: null`; success may exceed 100. SAN gain does not reset insanity conditions or the SAN-loss period. Mastery requires a successful first crossing from below 90 to at least 90 and an unclaimed skill flag; starting values already at 90 do not generate an award.

All tracker mutations and development use the same Web Lock, `rippers-character-write:<slug>`, and reread current storage under that lock. The tuple is checked before RNG. A durable pending reservation precedes each D100, D10 or 2D6 generation; the generated result is then saved. Final skill values, cleared local mark, SAN, mastery flag, audit and completion receipt are committed together in one atomic `localStorage.setItem`. A completed event returns its stored result without drawing dice.

If a result was stored but a later stage failed, **Finish Recorded Development** resumes from stored dice. If execution/storage failed between reservation and result storage, the pending reservation blocks replacement dice and requires Keeper reconciliation; there is deliberately no automatic reroll or reset button. Other tracker mutations are blocked while that journal is unresolved. This is a fail-closed exception, not a completed audit result.

Tracker reset retains progression/history/mastery. Legacy imports retain existing progression and cannot resurrect processed marks. A backup whose progression differs from this browser is rejected for Keeper reconciliation, including transfer to a fresh device; exports still contain the full progress. No cross-device import guarantee is claimed. Corrupt/unreadable tracker JSON is not silently replaced with defaults.

Existing v1/v2 trackers are read compatibly; schema 3 is written on the next authorized mutation. No adventure attribution is guessed. Before activation, reconcile legacy skill IDs (including existing `language-own-N` IDs), check origins and any previously awarded mastery/history. The language earning controls remain exactly as found, including languages that currently have no check control.

## Player states — descriptions verified in browser

- **LOCKED:** explanation only; no dice button. Missing upstream data and active adventures both fail closed.
- **AVAILABLE:** completed adventure title, first eligible checked skill, current value and deliberate **Make Development Roll** action.
- **IN PROGRESS:** committed result cards followed by the next checked skill. No page-load batch rolls.
- **COMPLETE:** permanent result list with pre/post values, dice, Hard/Extreme and mastery/SAN cap details; no development button. An empty eligible inventory displays a clean completion message and saves its receipt.
- **ARCHIVED:** prior summaries in an expandable read-only history. No reroll control is present, including while a later adventure is active.

Desktop and 390px mobile screens were inspected. The existing dark teal/gold dossier styling is retained. For a reward roll of 9 at SAN 95 with maximum 99, the UI correctly reports **5 points limited** (4 applied).

## Acceptance results

**All 20 requested checks pass at the engine/fixture level.** The full browser flow uses the actual Liquid sheet and base templates and local QA data. These results do not certify live campaign eligibility or distributed persistence; those remain blocked by the dependencies above.

| # | Acceptance test | Result / evidence |
| --- | --- | --- |
| 1 | Locked during active adventure | PASS — engine and browser; no action. |
| 2 | Available after completion | PASS with read-only fixture; completion object unchanged. Live adapter absent. |
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
| 18 | Adventure attribution | PASS — audit retains origin; wrong/unattributed checks cannot resolve. Legacy migration remains PM work. |
| 19 | Next adventure clean | PASS — increased values persist, old checks cleared, new empty case has no rolls. |
| 20 | Spoiler regression | PASS for this change — no scenario/release data or scripts changed; sentinel release state unchanged through browser flow; unsafe context fields are not copied. Full live release rehearsal still belongs to PM QA. |

Additional tests cover missing participation, missing provider, incomplete check inventory, unmapped skills, languages, durable empty summaries, failed result writes, stored-D100 recovery and failed-final-commit recovery without repeating SAN. **27 Node tests pass**, plus the rendered-source browser suite. No JavaScript exceptions in the completed browser run. `git diff --check` and syntax checks pass.

Browser validation used Chromium 153 and LiquidJS rendering of the repository's real templates, with the existing integer-division convention registered. This is **not** a full Ruby/Jekyll production build; Ruby/Jekyll was unavailable here. PM should run the native Pages build before approving a merge.

Reproduce:

```sh
node --test tests/development.test.cjs
# Install liquidjs, js-yaml and playwright outside the source tree or in a QA environment.
# Ensure Playwright Chromium is installed; QA_CHROMIUM_PATH can select an existing binary.
NODE_PATH=/path/to/qa/node_modules node tests/development-browser.cjs
```

The browser fixture is excluded from the published site and does not ship test adventures or deterministic dice. No merge, production deployment, adventure completion or release action has been performed.

**BETWEEN-ADVENTURE LEVEL UP — HOLD / ISSUE REQUIRES PM DECISION**
