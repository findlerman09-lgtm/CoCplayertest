# Pass 1 — Site Frame & Navigation Architecture

This pass prioritizes **where things live** and **what persists during play** over final decorative art.

## Global level

Permanent top navigation:

- Home
- Investigators
- Documents
- Campaign Files

## Investigator level

Each investigator dossier uses the same context rail:

- Overview
- Character Sheet
- People
- Correspondence
- Documents
- Possessions

## Dossier access rule

Every investigator has a player-created dossier password gathered on the spoiler-free character survey. Entering the password unlocks every route inside that investigator's dossier and the successful unlock is remembered on that browser/device.

The public roster may advertise that a dossier exists, but the character pages themselves are gated.

The dossier password gate is intended as table-level access control for fictional material on a public static site. Particularly spoiler-sensitive future correspondence and reveals may additionally use the existing encrypted code-word system.

## Workspace level

Desktop uses three zones:

1. **Context rail** — where am I and what belongs to this dossier?
2. **Main workspace** — the page's actual content.
3. **Information rail** — current state, recent items, and fast-reference material.

Mobile collapses the context rail to horizontal navigation and moves the information rail below the workspace.

## Character sheet persistence

The Character Sheet is both reference and a small local play tool. The browser stores:

- current Hit Points / damage;
- current Sanity;
- current Luck;
- Major Wound marker;
- skill-use improvement checks.

There is **no dice roller**. Skills are merely marked during play and gathered into an Improvement Queue. The Keeper and player resolve advancement between scenarios. Published skill values remain canonical and can be updated in the repository after the development phase.

The Core Rulebook treats successful eligible skill uses as ticks/checks to be resolved during an Investigator Development Phase; Credit Rating and Cthulhu Mythos are not improvement-check eligible. The site mirrors that workflow without automating the roll.

## Scope rule

The site supports exactly three linked campaign files. It is not intended to become a campaign-management application, NPC encyclopedia, lore wiki, dice roller, or Keeper backend.

## Player-facing information rule

Shared material belongs under `/documents/`. Material intended for one investigator belongs inside that investigator's password-gated dossier. Unreleased Keeper information does not belong in ordinary public page content; code-word encrypted reveals are the exception deliberately built for table use.

## Survey addition

The spoiler-free player survey should add one administrative item that does not reveal the campaign premise:

**Create a private password you will remember.** It will be used later to open material prepared specifically for you. Do not reuse an important real-world password.
