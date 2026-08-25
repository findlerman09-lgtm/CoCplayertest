# Pass 1.6 — Access Flow

**Current-status note:** the original six-frame cabinet described during Pass 1.6 has since been simplified. The live player-facing flow is the single anonymous dossier-password form described below.

## Access layers

1. **Campaign archive key**
   - The cinematic splash remains the first page.
   - A campaign-wide key opens the archive and is remembered on that device.
   - Archive pages redirect back to the splash when that remembered access marker is absent.

2. **Personal dossier password**
   - `/investigators/` displays one anonymous password form and reveals no roster, investigator count, names, occupations, or portraits.
   - The password is campaign-issued rather than created through the character survey.
   - Hidden candidate records are generated only for the current player-facing investigator slots.
   - A successful password routes directly to its matching dossier and stores the same local access marker used by the character dossier gate.
   - The current cabinet contains the five campaign investigators. The non-canon Clara Whitcombe proof character is retained for development testing but is not a cabinet candidate.

3. **Team View milestone**
   - `_data/site_state.yml` contains the Team View state.
   - Team View remains a later reveal mechanism and does not change the fact that private dossiers require their own campaign-issued passwords.

## Spoiler discipline

The archive and Investigator entry flow expose no investigator identity before a valid dossier password is supplied. The public site remains static and therefore this is table-level access control rather than high-security authentication; especially sensitive later reveals should continue to use encrypted code-word material.

## Password storage

Only salted PBKDF2 verifiers are committed to the public repository. Plaintext dossier passwords are distributed separately and should not be added to source files, comments, or documentation.

## Pass 2 boundary

Event-aware Sanity and damage tracking, including one-time-loss logic and Major Wound/insanity state prompts, belongs to the character-state layer. No dice roller is planned.
