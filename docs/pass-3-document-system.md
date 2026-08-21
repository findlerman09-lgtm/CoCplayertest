# Pass 3 — Document, Correspondence, and Code-Word System

## Purpose

Pass 3 turns released player material into one reusable system without inventing campaign clues before the campaign team has approved them.

The live player site reads document records from `_data/documents.yml`. The same record can be rendered in the shared Documents archive, a character's Personal Documents page, or a character's Correspondence page depending on its access fields.

## Supported presentation types

The reusable record component supports:

- `letter`
- `telegram`
- `photograph`
- `newspaper`
- `notebook`
- `report`
- `map`
- ordinary text records through any other `type` value

The type changes presentation only. It does not change campaign truth or access permissions.

## Core record fields

```yaml
- id: unique-id
  title: Player-facing title
  type: letter
  type_label: Letter
  section: correspondence       # images | correspondence | reports | notes
  channel: correspondence       # correspondence | documents
  visibility: personal          # personal | shared
  owner: clara-whitcombe        # required for personal material
  owner_label: Clara Whitcombe
  source: Edwin Bell
  date: 30 September 1888
  released: true
  status: available             # available | sealed
  basis: fictional_insertion    # internal only; never rendered
  summary: Spoiler-safe description visible before opening
```

`basis` exists to preserve the project's historical-control discipline. Appropriate internal values include `historical_fact`, `historical_uncertainty`, `fictional_insertion`, `keeper_secret`, and `development_only`. It is not shown to players.

## Unsealed content

Text records may add:

```yaml
body: >-
  Markdown content shown when the record opens.
```

Image-based material may add:

```yaml
asset: /assets/documents/example.webp
alt: Player-safe image description
caption: Optional caption
transcript: >-
  Optional Markdown transcription.
```

A photograph or map can therefore be presented as the image itself with an optional transcript/annotation below it. The component does not require a separate page for every handout.

## Sealed / code-word records

A sealed record contains no plaintext in the public repository. Instead it has:

```yaml
status: sealed
lock:
  id: unique-lock-id
  iterations: 100000
  salt: "..."
  iv: "..."
  ciphertext: "..."
```

The browser uses PBKDF2-SHA256 and AES-256-GCM. A successful code word is remembered on that device and the document thereafter displays as OPEN.

The existing `MAGPIE` Clara item remains only as a non-canon development proof of this mechanism.

## Keeper content workflow

1. Decide exactly what material becomes available and whether it is shared or personal.
2. Confirm historical/fictional status in development notes before player publication.
3. Prepare the final player-facing text or image outside the public repository.
4. Add one record to `_data/documents.yml`.
5. For normal released material, add `body`, `asset`, or both and set `status: available`.
6. For a code-word reveal, encrypt the final HTML locally and put only the generated salt/IV/ciphertext into the record.
7. Commit and deploy. The appropriate archive page renders the record automatically.
8. Give the code word at the table only when the reveal is earned.

No duplicate copy should be maintained in both a character page and the shared archive. The data record is canonical; pages are views of it.

## Encryption helper

`tools/encrypt-document.mjs` accepts plaintext on standard input and prints a ready-to-paste YAML `lock` block.

Example:

```bash
RIPPERS_CODEWORD=MAGPIE node tools/encrypt-document.mjs clara-letter-01 < /tmp/clara-letter.html
```

Use a temporary plaintext file outside the repository and delete it after checking the ciphertext. Do not commit the plaintext of a sealed player reveal.

## Scope boundary

Pass 3 establishes document presentation, access, and reveal behavior. It does **not** decide the actual Adventure I handout list or populate the site with speculative clues. Those records should be added only after scenario clue architecture and PM reconciliation establish what the players can legitimately receive.

Scenario association and evolving case-folder continuity remain Pass 4 concerns.
