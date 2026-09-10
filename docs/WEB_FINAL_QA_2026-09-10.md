# The Rippers player website — implementation QA

Date: 2026-09-10

Branch: `feat/p11-approved-asset-integration`

Verified starting HEAD: `dcd90501c019b02e99099d95a64db1320cf77979`

## Verdict

The P11 asset integration and trusted-table release conversion are ready for PM review. Source-level QA passes. A real Jekyll build and rendered browser walkthrough are deferred because this Work environment has neither a Jekyll runtime nor a compatible managed preview entry point. This is a deferred environment check, not a source failure.

No merge or deployment has been performed.

## Implemented scope

- Installed the five exact approved investigator WebP portraits and replaced the favicon portrait fallback with plain dossier initials.
- Installed `CAM-LOG-001`, `CAM-ORN-001`, and `CAM-SMK-001`; the small mark is used only for favicons, touch icons, and the splash micro-mark.
- Preserved the existing H1–H5 simple release controls, accessible transcripts, and browser-local state IDs.
- Preserved the exact H2 text `V./N.—ask re rear room.`
- Replaced the missing `v01.bin`–`v09.bin` encrypted visual vault with ten ordinary Keeper-directed release records.
- Added scene-release controls for five NPC portraits and two Penfold scenes.
- Added post-direct-reveal controls for Surgeon `003B`, Surgeon `003C`, and `A1-ART-005`.
- Kept `A1-ART-005` unavailable in ordinary navigation until `003B` or `003C` has first been released; its filing instruction retains the declared-response/scene-resolution condition.
- Removed obsolete H1–H5 salts, IVs, ciphertext, and encrypted-art fields after retaining their five existing lock IDs.
- Removed the obsolete visual-vault references and the inaccurate base64 portrait wrappers.
- Left the pre-existing archive and investigator-dossier access systems unchanged; they are separate from player-material release controls.

## QA results

| Area | Result | Evidence |
|---|---|---|
| Baseline | Pass | Requested branch matched the requested starting commit before edits. |
| P11 package integrity | Pass | The accepted package checksum and all 130 entries in its checksum manifest verified. |
| Installed asset identity | Pass | All 20 installed player/UI assets match their package-manifest SHA-256 values byte for byte. |
| Investigator portraits | Pass | Five public portraits are wired directly to their approved WebP derivatives and have readable alt text. |
| Visual release matrix | Pass | Registry contains exactly five NPC portraits, two Penfold scenes, `003B`, `003C`, and `A1-ART-005`, with unique persistent lock IDs. |
| H1–H5 regression | Pass | Five original lock IDs remain unchanged; exact artifact/transcript routing remains in the existing handout include. |
| H2 wording | Pass | Required no-space wording is present in the accessible transcript; the spaced variant is absent. |
| Keeper-only exclusion | Pass | `003A`, `003D`, `003E`, `003F`, `A1-MAP-001`, and `A1-MAP-002` are absent from active player source and installed site assets. |
| Obsolete vault | Pass | No active `.bin`, staged-vault, encrypted-art, or visual-vault references remain. |
| Source data | Pass | All eight `_data` YAML files parse successfully; referenced release, portrait, handout, and brand files exist. |
| JavaScript syntax | Pass | `simple-release.js`, `reveal.js`, `portrait-loader.js`, and `case-desk.js` pass Node syntax checks. |
| Links and asset paths | Pass (source) | Literal player-site asset references resolve; primary routes and generated character dossier routes have source pages. |
| Reload state | Pass (source) | Releases use the existing `rippers-unlock-*` keys, restore on load, and refresh Case Files/Archive state through the existing unlock event. |
| Keyboard/accessibility | Pass (source) | Release actions are native buttons, record toggles are native summaries, focus-visible rules are present, images have alt text, and H1–H5 retain transcripts. |
| Mobile/print | Pass (source) | Release layouts collapse to one column at the existing mobile breakpoints; sealed records are omitted and opened art is simplified in print. |
| Jekyll build | Deferred | Ruby/Jekyll is unavailable in this environment. |
| Rendered browser walkthrough | Deferred | Managed preview cannot start this legacy Jekyll checkout because it has no supported `package.json` dev-server entry point. |

## PM-capable environment checks

Before merge, run the repository through a Pages-compatible Jekyll build and serve the result at its configured `/CoCplayertest` base URL. Confirm clean, released, and reload states in a real browser; test Case Files and Archive navigation; inspect narrow mobile layouts; keyboard through every release control and image viewer; and print both sealed and opened records.

Those checks should be recorded on the pull request. Merge and deployment remain explicitly out of scope until authorized.
