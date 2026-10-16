# Player-side state storage

The static GitHub Pages site stores play state per investigator in `localStorage` under `rippers-character-state:<slug>`. Existing HP, SAN, Luck, Mythos, wound/insanity state and improvement marks remain in this envelope. Private effects and access/release gates retain their existing separate keys.

The investigator-development review branch adds schema 3: permanent skill overrides, append-only development audit entries, completion receipts, per-skill mastery claims and a durable in-flight dice journal. These fields are retained by tracker reset and protected from rollback through tracker import. Hard/Extreme and the sheet's combat/language references display current skill values. Original P-07 data remains the starting baseline.

Development is **not activated**: the repository currently has no authoritative completed-adventure/participation projection or adventure-scoped check source. No check origins are inferred. See [the PM handoff](INVESTIGATOR_DEVELOPMENT_PM_HANDOFF_2026-10-16.md) for the read-only adapter contract, migration requirements and all acceptance results.

Web Locks serialize current-client writes across tabs; each write rereads the latest envelope. Dice reservations and results are persisted before proceeding. Incomplete unsaved results fail closed for Keeper review rather than rerolling. A final commit applies the value, mark clearing, SAN/mastery and audit together. A browser without Web Locks has no development roll action.

This remains browser-local persistence, not an account-backed or cross-device authority. Clearing/evicting storage, console edits or an old client can invalidate that model. Progression backups can be exported, but imports with differing development history require Keeper reconciliation; silent replacement is disallowed. PM must decide whether this model is acceptable or authorize a shared durable backend. The previous workflow published Keeper-resolved advancement back to repository data; that reconciliation policy also requires a decision before activation.

No campaign completion, release state, Keeper information, credentials or next-adventure state is written by the development feature.
