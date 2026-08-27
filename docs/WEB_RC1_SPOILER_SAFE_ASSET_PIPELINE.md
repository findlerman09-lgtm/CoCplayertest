# WEB-RC1 Spoiler-Safe Asset Pipeline

Status: active production rule for the public player repository.

The player website is a theatrical spoiler gate, not confidential storage. Anything committed to a normal public repository path should be assumed discoverable by a determined player.

## Public-safe rule

A normal public asset may be committed only when **all** of the following are safe before reveal:

- filename;
- directory path;
- image pixels;
- EXIF/embedded metadata;
- SVG text/layers;
- alt text;
- caption;
- preload/link metadata;
- source-map or build references;
- nearby YAML/front-matter labels.

Changing only the visible page state is not enough.

## Reveal-dependent art

If discovering the raw image early would spoil play:

1. do not place it in a plainly named public asset path;
2. do not reference it from plaintext player-facing YAML;
3. keep the sealed catalogue title generic;
4. package reveal-safe content only after the controlling authority approves the player derivative;
5. when practical, place the visual content inside the encrypted release payload rather than exposing a hidden ordinary file;
6. test the generated site and public repository search for names, labels, filenames, captions, and physical/mechanical terms that should remain hidden.

## Filename policy

Prefer stable, non-spoilery filenames such as:

- `a1-por-001-player.webp`
- `a1-map-001-player.webp`
- `record-visual-01.webp`

Avoid filenames that reveal guilt, future states, supernatural identity, hidden locations, or Keeper-only causal relationships.

## Metadata policy

Strip nonessential image metadata from website derivatives. Retain provenance, credits, and production notes in the controlled production ledger rather than embedding Keeper spoilers in public files.

SVG assets require special review because labels, hidden groups, layer names, comments, and accessibility text remain inspectable as source.

## Alt text and captions

Accessibility copy follows the reveal state, not the Keeper truth.

At first release, describe what a player can reasonably see or knows at that moment. Do not use alt text to encode a later diagnosis, identity, mechanical weakness, or campaign explanation.

## Maps and handouts

Where Keeper and player information differs, create separate exports. Never rely on a hidden SVG/PDF layer, `display:none`, CSS masking, or an off-canvas object to protect Keeper information.

Meaningful clue text should be controlled as text and proofed independently. Generated image lettering is not canonical clue copy.

## Pre-commit scrub

Before merging an asset pass:

- search the repository for forbidden names/terms relevant to unreleased material;
- search the generated Pages artifact, not only source;
- inspect HTML source for safe sealed labels;
- verify print output omits sealed records;
- verify the browser does not prefetch an unreleased raw image;
- verify a clean browser profile does not receive the reveal asset until the correct release state;
- verify a second clean profile remains sealed.

## Incident rule

If a spoiler-bearing asset is accidentally committed publicly, assume it was discoverable. Remove it promptly, rotate any affected release packaging if necessary, and record the correction. Git history is not a confidentiality boundary.

## Authority boundary

This pipeline controls packaging and delivery only. It does not decide what an image depicts, which version is canon, or when a scenario reveal should occur.
