# The Rippers — Player Site Update for Project Manager

**Date:** 2026-08-24  
**Status:** Specialist implementation update; no campaign canon changed by this document.

## Executive summary

The player-site framework has reached a mature validation stage. Core access, investigator dossier, character-state tracking, sealed reveals, documents, correspondence, and case-file architecture are implemented and operating. Recent work has focused on visual polish and usability rather than new mechanics or campaign content.

The active validation pass is **Pass 5D — content-container validation**. It uses clearly labelled non-canon demonstration records to test how multiple document types, sealed/open correspondence, personal files, and case-file entries interact in the real layout. This is specifically intended to prevent speculative demo content from being mistaken for scenario canon.

## What is currently working

- Archive splash and archive-key access flow.
- Single private investigator dossier gate; pre-Team View reveals no roster or other investigator information.
- Individual dossier navigation and local per-investigator state.
- HP, SAN, Luck, Major Wound, insanity/bout handling, improvement marks, and private effects.
- Local state export/import.
- Reusable shared/private/sealed document architecture.
- Client-side code-word encrypted reveals.
- Player-safe Case File architecture.
- Current Clara proof dossier and character-sheet presentation.
- Visual shell, investigator lock, and splash treatment are close to locked.

## Deferred mechanical requirement

One mechanical layer remains intentionally deferred: **between-adventure Downtime / Development state**.

This should not be implemented until Adventure I's aftermath and the transition into Adventure II are defined. The scenario must determine elapsed time, recovery opportunities, improvement timing, and any campaign-specific consequences before the site guides players through those steps.

Proposed eventual state flow:

`Active Case -> Downtime / Development -> Ready for Next Case`

This should remain a bounded transition workflow, not become a general campaign-management subsystem.

## Pass 5D validation purpose

Current correspondence testing exposed layout issues that cannot be judged reliably with only one sample record. Shared Documents, Personal Documents, and Case Files also need enough released material to stress-test their containers.

Pass 5D therefore adds a small, explicitly non-canon demonstration set covering:

- multiple Clara correspondence items, including sealed and already-open records;
- multiple shared document types;
- personal documents separate from correspondence;
- multiple case-file entries and linked shared documents;
- short and long summaries to test wrapping and vertical rhythm;
- open and sealed states to test interaction hierarchy.

The pass also corrects the observed correspondence alignment problem so metadata, sealed interaction, and revealed paper read as one coherent record.

## Canon and governance boundary

The demonstration records introduced for validation are **not scenario proposals and are not canon**. They should be removed or replaced when real Adventure I material exists.

No Jack identity, clue, victim detail, historical claim, supernatural fact, player hook, person, location, or reveal timing should be inferred from the demo records.

The website should now be treated primarily as a publication surface waiting for scenario-authorized content rather than as a source of new campaign design.

## PM decisions / reconciliation eventually needed

1. Confirm the site architecture as the intended player-facing publication surface after Pass 5D validation.
2. When Adventure I reaches aftermath design, reconcile the Downtime / Development workflow against actual scenario chronology and the Call of Cthulhu/Pulp rules in use.
3. When final investigators are locked, replace Clara and other validation-only material with finalized character dossiers.
4. As Adventure I handouts and player-known facts are approved, populate the existing Documents, Correspondence, and Case Files systems rather than creating parallel delivery mechanisms.

## Current recommendation

Finish Pass 5D, visually lock the archive containers, and then stop speculative site expansion. Further substantive population should follow scenario and character development.
