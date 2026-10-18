# Scenario II artwork — review checkpoint

The supplied A2 website art pack is integrated into each canonical investigator's existing Scenario Workspace. The workspace remains gated by completed Adventure I development.

- One optimized WebP masthead appears after workspace unlock.
- People: records 01–05. Places: records 06–09. Separate sealed scene: record 10.
- Each record needs its own Keeper-issued password; encrypted payloads contain both image and descriptive metadata. Passwords and plaintext gated assets are not committed.
- AES-GCM payloads use PBKDF2-SHA256 with 210,000 iterations, random salt and IV per record. Browser remembers the derived key after successful opening. Simple shared passwords are intended for table release, not account-based authorization; players can share opened images/passwords.
- Sealed records are not fetched until a password is submitted. Previously opened records reload from saved browser keys. Public placeholders contain no character names or reveal text.
- Source PNG masters, manifest and Keeper-only collage are deliberately excluded from the repository. Art does not establish new plot, mechanics or final visual canon.
- Existing Adventure I release keys, adventure state and permanent character values remain unchanged.

Validation: all ten bundles decrypted and rendered in Chromium; wrong-password rejection, hidden titles, no sealed preloading, lowercase password normalization, reload persistence, 390px layout and no JavaScript errors passed. Existing integrated development suite passed, including partial/final unlock, clean no-check completion and separate scenario start. Syntax and whitespace checks passed.

Reproduce artwork test with private release-code JSON supplied through A2_QA_CODES, Playwright on NODE_PATH and optional QA_CHROMIUM_PATH. Never commit the private JSON. Test: node tests/scenario-art-browser.cjs.

Resume: implementation and browser validation complete. Review this branch; do not regenerate encrypted assets or passwords unless explicitly rotating codes. Password mapping is delivered privately in the conversation. Production merge/deploy is left for review under the existing PM QA instruction.
