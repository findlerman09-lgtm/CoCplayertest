# WEB-RC1 — Case Release Gate Schema

This is a downstream website implementation note. It does not create scenario canon or release authority.

## Purpose

Case Files can now host Keeper-controlled sealed records for people, portraits, photographs, locations, evidence plates, and scene images. The same PBKDF2/AES-GCM reveal system used for RC1.1 handouts is reused.

A release gate controls only the optional player-facing artifact. It must never control whether a core clue, NPC, location, or scene exists in play.

## Public-repository safety rule

Do not put an unreleased person's true name, spoiler-bearing image filename, clue text, hidden state, or image path in plaintext YAML merely because the page is visually sealed.

Before authorization, either:

1. omit the release entirely; or
2. keep it `listed: false` with reveal-safe metadata only.

When a sealed release is authorized, the plaintext catalogue fields must remain reveal-safe. Put the true title, description, and any spoiler-bearing material inside the encrypted payload.

For an image that must exist before its table release, do **not** commit the raw image as an ordinary public asset. The supported safe preparation path is to embed an approved player image as a data URI inside the encrypted HTML payload, or otherwise keep the asset out of the public repository until its release boundary changes.

## Data shape

```yaml
items:
  - id: neutral-record-id
    case_file: current-file
    kind: person # person, portrait, photograph, location, evidence, scene
    listed: true
    status: sealed
    safe_label: Sealed witness record
    safe_title: Filed Person
    safe_summary: A person record awaiting Keeper release.
    lock:
      id: unique-lock-id
      iterations: 100000
      salt: "..."
      iv: "..."
      ciphertext: "..."
```

The ciphertext should decrypt to complete player-facing HTML, normally beginning with an `<h2>` containing the true released title. After unlock, `assets/reveal.js` promotes that encrypted heading into the visible record title.

## Encrypting payloads

`tools/encrypt-document.mjs` accepts arbitrary HTML and can be reused for these releases:

```sh
RIPPERS_CODEWORD=WORD node tools/encrypt-document.mjs unique-lock-id < payload.html
```

The plaintext code word remains Keeper-only and must not be committed to the player repository.

## Portrait/photo payload example

```html
<h2>Released person or image title</h2>
<div class="case-person-summary">
  <figure>
    <img src="data:image/webp;base64,..." alt="Reveal-safe description of the now-released image">
  </figure>
  <div>
    <p>Only information the investigators have now actually learned.</p>
  </div>
</div>
```

Do not use image metadata, captions, filenames, or alt text to leak Keeper-only information.

## Release behavior

- Wrong code: no state change.
- Code normalization: trim leading/trailing whitespace and uppercase before testing.
- Successful unlock: persists in that browser profile using the existing `rippers-unlock-<lock-id>` localStorage key.
- Other clean browser profiles remain sealed.
- Still-sealed records are omitted from print.
- Hash links can open both document records and generic case-release records.

## RC1 boundary

The infrastructure may remain present while `_data/case_releases.yml` contains no listed entries. Actual person/photo records should be installed only from PM/Production/Art-controlled material and the current rehearsal release plan.
