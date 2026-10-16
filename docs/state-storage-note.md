# Player-side state storage

Browser persistence is the approved model for this feature. Each investigator's state stays in `localStorage` under `rippers-character-state:<slug>`. HP, SAN, Luck, Mythos, wound/insanity state and improvement marks remain in the existing envelope. Access, releases and private effects retain their separate keys.

Schema 4 adds permanent skill overrides, development history and receipts, mastery flags, a durable dice journal, current/completed adventure bookkeeping, adventure-scoped check records and unassigned legacy marks. Existing v1/v2/v3 trackers are read compatibly. Old marks are never silently assigned: the completion UI lists them and requires explicit confirmation of their adventure. New eligible marks receive the current adventure ID automatically, without changing earning rules.

The Keeper-confirmed completion control establishes adventure completion and investigator participation. Development consumes a read-only projection of that state. Resolving all eligible checks (or a confirmed no-check completion) automatically reveals the second-scenario workspace. A separate Keeper-confirmed start begins tracking the second adventure. No handout, correspondence, reveal or scenario-mechanics state is written by these controls.

Web Locks serialize tracker, bookkeeping and development writes across tabs. Dice reservations/results are stored before proceeding. Incomplete unsaved results require Keeper reconciliation instead of rerolls. Final skill, SAN, mastery, mark and audit changes commit together. Reset retains progression, marks and adventure history. Imports cannot replace differing progression or resurrect processed checks; exports include full saved state. A browser without safe lock coordination cannot resolve development.

Values survive reload, back navigation, closing/reopening and lock/sign-out/return in the same browser profile. There is no cross-device synchronization. Explicit deletion/eviction of browser storage, console edits and older clients remain outside this persistence guarantee. Use a consistent browser profile and refresh older tabs at deployment. The original P-07 data remains a starting baseline, while earned increases live in the saved profile.

See [the current PM handoff](INVESTIGATOR_DEVELOPMENT_PM_HANDOFF_2026-10-16.md) for the full schema, migration, UI states and all acceptance results. The change remains on a draft review branch until PM QA and approval.
