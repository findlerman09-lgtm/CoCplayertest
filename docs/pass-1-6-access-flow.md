# Pass 1.6 — Access Flow

This pass completes the pre-content architecture before Pass 2.

## Access layers

1. **Campaign archive key**
   - The cinematic splash remains the first page.
   - A campaign-wide key opens the archive and is remembered on that device.
   - Archive pages redirect back to the splash when that remembered access marker is absent.

2. **Personal dossier key**
   - `/investigators/` defaults to six sealed frames, I–VI.
   - No investigator identity is shown in the default cabinet view.
   - One password field tests the configured investigator credentials.
   - A successful key opens only its matching frame and stores the same local access marker used by the character dossier gate.
   - Empty/unassigned frames are visually indistinguishable from assigned sealed frames.

3. **Team View milestone**
   - `_data/site_state.yml` contains `team_view: false`.
   - When the Keeper decides the group has reached the reveal point, change the flag to `true`.
   - Team View reveals the shared-facing identity cards for assigned investigators while leaving every private dossier password-protected.

## Spoiler discipline

The archive landing page contains no investigator names or portraits before Team View. The public site remains static and therefore this is table-level access control rather than high-security authentication; especially sensitive later reveals should continue to use encrypted code-word material.

## Pass 2 boundary

Event-aware Sanity and damage tracking, including one-time-loss logic and Major Wound/insanity state prompts, belongs to Pass 2. No dice roller is planned.
