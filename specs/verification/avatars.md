# Avatar and AvatarGroup acceptance

Date: 2026-10-29. Scope: AVATAR-001 through AVATAR-005 and AVGROUP-001 through
AVGROUP-005. This accepts these two adapted catalog entries, not the remaining Nuxt
inventory or separate Tooltip/Chip integrations.

## Requirement evidence

| Requirement | Evidence                                                       |
| ----------- | -------------------------------------------------------------- |
| AVATAR-001  | Closed schema, URL failures, named Props, negative type tests  |
| AVATAR-002  | Grapheme/uppercase tests, named core dimensions, size examples |
| AVATAR-003  | Native load/error/source changes in adapter and Chromium tests |
| AVATAR-004  | Generative replacement, portable schema, SSR hydration tests   |
| AVATAR-005  | Full coverage, packed consumer, compiled docs, browser matrix  |
| AVGROUP-001 | Unique IDs, empty arrays, max/size constraints, own modules    |
| AVGROUP-002 | Accurate +N, singular/plural, keyboard native disclosure       |
| AVGROUP-003 | Stable IDs, wrapping, long names and +99 at 200% text          |
| AVGROUP-004 | Shared adapter, generative validation, SSR and theme changes   |
| AVGROUP-005 | Complete adapter registry, package/types/docs/browser checks   |

Tests are colocated under `src/core`, `src/schema`, `src/components`,
`src/adapter/shadcn`, `src/state/generative-ui`, and `docs/examples`. Browser
conformance is `demo/e2e/avatar.spec.ts`: 18 scenarios, eight widths from 240 through
1920, both profiles, enlarged text, image recovery, and disclosure keyboard use.

The full local check has 461 tests in 80 files, per-file 100% statements, branches,
functions, and lines across 266 measured executable files. Totals: 1552 statements, 879
branches, 461 functions, 1425 lines. All 74 Chromium scenarios, packed TSX/SSR, negative
fixtures, schema freshness, source policy, and strict MkDocs passed. The combined log is
`.cache/state-avatar-check.log`.

The source recipes and adaptation boundaries are recorded in the component specs and
`specs/catalog/shadcn-provenance.json`. Sample assets are explicit local placeholders;
the error fixture is intentionally undecodable, with no fabricated identity claims.

## UI direction and delivery check

Reading this as the existing technical component catalog for application developers.
ENERGY 1 / RHYTHM 2 / MOTION 1. Existing token typography, green primary actions, and
source/preview examples remain the visual language. Images illustrate loading; circles
distinguish identities, and the count opens the complete hidden list.

The full baseline gate in `generative-state.md` still applies. Scoped evidence follows.

- R-02 PASS: English labels use plain punctuation.
- R-03 PASS: 16 geometry scenarios contain avatars/counts at all widths and 200% text.
- R-17/R-18/R-23/R-38 PASS: counts derive from labeled sample items and placeholders.
- R-24 PASS: strict MkDocs resolves both references and their source snippets.
- R-25 PASS: avatar text uses the existing contrast-validated text/surface tokens.
- R-26/R-32 PASS: examples exercise every selector/toggle/slider and keyboard
  disclosure.
- R-27 PASS: load, decode error, successful recovery, empty, and overflow states pass.
- R-28/R-36 PASS: public references contain no FAQ filler or performance claims.
- R-33 PASS: changes are maintained source modules and renderer CSS.
- R-34/R-35 PASS: both profiles pass real production browser acceptance.
- R-37 PASS: work extends the existing catalog direction recorded above.
- R-39 PASS: named identity roots, decorative images, native summary, focus and
  wrapping.
- R-40 PASS: images have dimensions, stable square space, and lazy loading.
- PURPOSE PASS: no gradient, glow, glass, decorative arrows/grid, or stock art added.
- R-04/R-06 PASS: existing menu chevrons and typography keep their control/source roles.
- R-09/R-12/R-13/R-14 PASS: count circles show real overflow; no decorative card set.
- R-19 PASS: no animation added; existing reduced-motion handling remains active.
- DIALS PASS: ENERGY 1 / RHYTHM 2 / MOTION 1 retained with no promotional section.
- FOCUS/SPACE/ACCENT/IDENTITY PASS: named previews, token gaps, existing green accent.
- READ PASS: technical-catalog direction is stated above.
- C-1/C-2/C-3 PASS: controls demonstrate identity loading, sizing, data, and disclosure.
- C-4/C-5 PASS: browser geometry passes; sample identities are explicitly fictional.
- R-05/R-11/R-15/R-16 PASS: content follows technical examples and specific labels.
- R-20/R-21/R-29/R-30 PASS: existing two-profile product catalog and palette retained.
- R-31 PASS: token type/spacing and stable circles follow component responsibilities.

Inspected `.cache/avatar-desktop.png` and `.cache/avatar-mobile.png`. Long names wrap in
the narrow, enlarged view. Hidden identities remain reachable through scrolling. An
early browser test exposed asynchronous Select focus restoration; the interaction helper
now waits for the trigger to regain focus before testing another control.

No commit, push, publication, deployment, or DNS change occurred. The demo chunk-size
warning and broader enterprise acceptance remain tracked in `specs/verification.md`.
