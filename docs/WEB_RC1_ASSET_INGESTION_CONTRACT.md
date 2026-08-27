# WEB-RC1 Asset Ingestion Contract

Status: active implementation contract for RC1 asset intake.

This document controls how approved production assets are installed into the player website. It does not create campaign canon. PM reconciliation, Canon/Document Control, Production, P-09, and the controlling Art Director manifest remain upstream authorities.

## Required intake fields

Every incoming final or candidate asset must arrive with the following information before it is installed:

| Field | Required | Purpose |
|---|---|---|
| Asset ID | Yes | Stable production identifier. Do not invent a replacement ID on the website. |
| Controlling authority | Yes | PM / Production / P-09 / Art manifest source that approved the asset. |
| Approval state | Yes | Candidate, approved master, approved derivative, or superseded. |
| Player/Keeper visibility | Yes | Whether the asset may exist in the public player payload before reveal. |
| Reveal moment | If gated | Exact table condition that makes the asset player-safe. |
| Website slot | Yes | Investigator portrait, location plate, handout, case release, map, scene image, etc. |
| Master dimensions | Yes | Pixel dimensions and intended print size if applicable. |
| Aspect ratio | Yes | Used to prevent accidental crop changes. |
| Focal point | Recommended | CSS object-position, expressed as `x% y%`, for responsive crops. |
| Alt text | Yes for informative player-facing art | Describes only information already safe for the player at that reveal state. |
| Caption | If used | Controlled copy; never generated from the image file name. |
| Credit/provenance | Yes | Production source, public-domain source, or controlled original-art record. |
| Public filename | Yes if committed publicly | Must be reveal-safe and non-spoilery. |
| Placeholder replaced | If applicable | Existing slot or placeholder to retire. |
| Print use | Yes/No | Whether the same derivative may appear in printable player material. |

## Intake decision

Before committing an asset, answer these questions in order:

1. Is this exact asset approved by an upstream authority?
2. Is it safe for a player to discover the raw file before its intended reveal?
3. If no, keep the raw art out of the ordinary public asset tree and use encrypted release packaging or wait for the reveal-safe derivative.
4. Does the supplied crop preserve the approved identity/composition?
5. Are the alt text, caption, filename, metadata, and surrounding copy equally reveal-safe?
6. Does the asset replace an existing placeholder without changing clue logic or release conditions?
7. Has a grayscale/print check been completed where the asset is printable?

If any answer is unresolved, the website retains the existing placeholder. A missing image is preferable to inventing canon or leaking unreleased material.

## Website slots

The site supports these stable asset classes:

- investigator portrait;
- NPC/person portrait;
- location plate;
- photograph/evidence image;
- handout image or document facsimile;
- functional map/schematic;
- scene/revelation art;
- campaign ornament or identity mark.

Use the universal controlled-art component for normal player-safe images. Use encrypted case-release payloads for reveal-dependent imagery whose raw asset is not safe to publish early.

## Replacement rule

Final art should replace placeholders **in place**. Do not create a parallel page, new password, or second clue merely because artwork has arrived.

The expected transition is:

`placeholder slot -> approved master/derivative -> same release condition -> same archive record`

## Accessibility and responsive behavior

- Informative images require useful alt text.
- Decorative images use empty alt text.
- Captions must not reveal information not present in the image or already established in play.
- Approved focal identity must survive phone, tablet, desktop, and print crops.
- Do not put essential clue text inside raster imagery when it can be typeset as controlled HTML/text.
- The full-image inspection view is supplemental; the page must remain usable without opening it.

## Freeze boundary

With this contract installed, WEB-RC1 feature development is frozen except for:

- approved asset ingestion;
- final Production handout ingestion;
- P-09 identity ingestion;
- accessibility defects;
- release-state synchronization;
- defects demonstrated by rehearsal.

The website remains a downstream implementation surface, not a canon authority.
