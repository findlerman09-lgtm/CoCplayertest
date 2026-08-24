# Pass 4 — Player Case Files and Continuity

## Purpose

Pass 4 gives the player archive a light campaign-continuity layer without turning the site into a Keeper wiki, session log, or evidence-management database.

The Case Files section is a set of evolving folders containing only information the players are entitled to know.

## Visibility rule

A case file must not appear in `_data/case_files.yml` as `visible: true` until the existence of that file is legitimate player knowledge.

Do not create visible placeholders for future Victorian adventures merely because the campaign developer knows they will exist. In particular, the player-facing site must not advertise a fixed trilogy or any future continuation.

The current proof data therefore contains only one neutral record: `Current File`.

## Case record

```yaml
files:
  - id: current-file
    visible: true
    title: Current File
    status: open            # open | sealed | archived
    status_label: Open
    summary: Released shared material associated with the open case.
    known_people: []
    known_locations: []
```

`id` is an internal routing key, not a campaign title. Player-facing names should remain spoiler-safe.

### Statuses

- `open` — the folder may display released shared material, known people, and known locations.
- `sealed` — the players may know the file exists, but the site displays no contents from it.
- `archived` — the case is concluded, but player-known material remains available as part of campaign continuity.

A file that the players do not yet know exists should be omitted or have `visible: false`; it should not be represented by a sealed teaser.

## Associating documents

Pass 3 document records may optionally add:

```yaml
case_file: current-file
```

The Case Files page then links to the canonical shared document record in `/documents/`. It does not duplicate the handout content.

Only records with all of the following are surfaced inside a case folder:

- `released: true`
- `visibility: shared`
- matching `case_file`

Personal correspondence and private character documents remain in that investigator's dossier unless they actually become shared table knowledge.

## Known people and locations

`known_people` and `known_locations` are deliberately lightweight. They are not NPC or location databases. Each entry is only a name plus an optional short player-known note.

```yaml
known_people:
  - name: Example Name
    note: Only what the players currently know.
known_locations:
  - name: Example Place
    note: Only what the players currently know.
```

Do not place unrevealed motives, hidden identities, Keeper conclusions, or secret chronology in these fields.

## Continuity across files

When a case concludes:

1. Change its status to `archived` rather than deleting it.
2. Leave released documents in the canonical document store.
3. Leave personal correspondence and documents with their investigator.
4. Carry injuries, SAN state, skill-development marks, and other current character state through the character tracker rather than copying them into the case file.
5. Carry relationships forward on the relevant character's People page when those relationships materially change.

This keeps continuity attached to the thing that owns it instead of building a second campaign database.

## Explicit exclusions

Pass 4 does not add:

- session logs
- Keeper notes
- clue-solution trees
- antagonist timelines
- hidden factions
- an organization database
- future-case teasers that players have not earned
- any reference to the later `When is Jack?` continuation

The Case Files layer is an archive of player knowledge, not the campaign manuscript.
