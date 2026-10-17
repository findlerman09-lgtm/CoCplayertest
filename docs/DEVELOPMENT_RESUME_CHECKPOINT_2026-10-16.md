# Investigator development — saved checkpoint

Verified 16 October 2026 (America/Detroit).

## Authoritative current status

PR #51 is merged, not draft. Main is 64a46f812b4437fdfacba8544bf89a38a4e12abc; implementation tree is 767af69a6a200ed8a6cfcd93dbd9bc8b7b94748d. The prior implementation handoff's unmerged/undeployed statements describe its earlier delivery time and are now superseded by this checkpoint.

GitHub Pages run 38942701746 succeeded: native Build with Jekyll, artifact upload, and deployment all passed. This closes the native-build verification gap in the earlier handoff.

- PR: https://github.com/findlerman09-lgtm/CoCplayertest/pull/51
- Build: https://github.com/findlerman09-lgtm/CoCplayertest/actions/runs/38942701746
- Site: https://findlerman09-lgtm.github.io/CoCplayertest/

## Completed checkpoints

1. Implementation: browser persistence, adventure-scoped marks, one-time development rolls/history/mastery, separate Keeper-confirmed completion/start, automatic second-workspace unlock after all development (including no-check completion).
2. Behavioral QA: previously completed 37 Node tests and both browser modes, including concurrency, interruption, SAN caps, reset/import protection, mobile and spoiler regression. Full evidence and all twenty acceptance results are in INVESTIGATOR_DEVELOPMENT_PM_HANDOFF_2026-10-16.md.
3. Deployment verification: successful native Jekyll build/deploy checked through GitHub. All five canonical investigators' published scenario routes return rendered workspace markup. Seven published assets (adventure-state, adventure-ui, development-engine, development-ui, character-state, skill-values and development.css) match tested repository bytes exactly. No production character state or release controls were changed during this read-only verification.

## Remaining player/PM walkthrough

Use a separate browser profile for testing so real player progress is untouched. Browser data is local to that profile and does not synchronize devices. This is acceptance review, not a remaining implementation dependency.

1. Open an investigator sheet during the active first adventure: development and second workspace must be locked.
2. Earn/check a permitted skill using existing controls. In Adventure Progress, confirm Keeper completion and participation; explicitly confirm older mark origins if prompted.
3. Finish Adventure, then resolve each eligible skill. Observe updated permanent values and summary; partial completion must leave the second workspace locked.
4. Once all skills are resolved, open How is Jack? workspace. Reload and confirm values/history persist.
5. Use the separate Keeper-confirmed Begin Scenario action. Verify old marks are clear and new marks belong to the second adventure.
6. Confirm existing correspondence/handout release controls still apply. The second workspace is a shell connecting existing tools; new scenario scenes or handouts are not part of this implementation.

## Resume instructions

Read this checkpoint first. Do not restart implementation, rerun all passing tests without a concrete reason, or re-merge PR #51. No known code defect remains from the completed checks. If PM reports a problem, reproduce that specific issue, make a bounded fix on a fresh branch from current main, validate it, and return a review PR. Do not deploy further changes without authorization.

Work in small units: inspect one issue, implement one coherent fix, verify it, then push a commit and update this checkpoint with exact status and next action. This document is saved on codex/development-qa-checkpoint without changing production.

BETWEEN-ADVENTURE LEVEL UP — READY FOR PM QA
