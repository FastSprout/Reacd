# Chip and Tooltip acceptance

Date: 2026-10-29. Scope: CHIP-001 through CHIP-006, TOOLTIP-001 through TOOLTIP-006, and
the related MODAL-009 dismissal ordering. These two adapted entries are accepted; the
full 132-entry catalog remains outstanding.

## Requirements and evidence

| Requirement | Evidence                                                          |
| ----------- | ----------------------------------------------------------------- |
| CHIP-001    | Own closed schema, named Props/function, negative type tests      |
| CHIP-002    | Dot/zero/text, full accessible title, show/standalone tests       |
| CHIP-003    | Four logical corners, edge geometry, RTL, both profiles, 200%     |
| CHIP-004    | Private shadcn Badge recipe, typed action and theme preservation  |
| CHIP-005    | Literal/read bindings, host constraints, isolated SSR hydration   |
| CHIP-006    | Full adapter mapping, packed TSX/SSR, portable schema, docs       |
| TOOLTIP-001 | Named modules, controlled pair types, closed children/props       |
| TOOLTIP-002 | Keyboard, Escape, popup hover, preserved actions and touch        |
| TOOLTIP-003 | Observer tests for internal/outer hidden and tabbable content     |
| TOOLTIP-004 | Dialog host, retained lifecycle, bounds, nested Escape regression |
| TOOLTIP-005 | Automatic/controlled state, boolean binding, SSR in both modes    |
| TOOLTIP-006 | Full mapping/coverage, package/schema/docs/browser acceptance     |
| MODAL-009   | Independent dismissal scopes, outside-focus and lease tests       |

Colocated tests cover schemas, public types, adapters, state bindings, SSR/hydration,
and compiled documentation examples. Browser coverage is
`demo/e2e/chip-tooltip.spec.ts`: 16 geometry cases, two lifecycle flows, and one touch
case. Geometry uses eight widths from 240 through 1920, both templates, all logical
corners, RTL, and 200% text.

The complete local check passes 486 tests in 91 files. All four coverage categories are
100% per measured executable file across 286 files: 1707 statements, 987 branches, 500
functions, and 1574 lines. All 93 Chromium cases pass. Packed consumer TSX/SSR, negative
fixtures, schema freshness, strict typing/lint, source policy, and strict MkDocs also
pass. Evidence: `.cache/chip-tooltip-check.log`.

## Reproduced regressions

- An explicit null Base UI portal container prevented body mounting. The adapter now
  uses the default body outside dialogs and the nearest non-null host inside them.
- A hidden outer panel polluted internal tab-stop detection. The failing test observed
  tabindex 0 after a descendant became tabbable; the corrected test observes -1.
  `.cache/tooltip-hidden-regression-before.log` records the reproduced failure.
- Escape could reach the dialog while a hint was open from hover with focus elsewhere.
  The trusted trigger handles focused Escape. A separate per-dialog scope handles the
  outside-focus case through registered hint dismissal leases before closing the dialog.
  Unit tests exercise outside focus, last-layer priority, independent cleanup, and empty
  scopes. Eight repeated pointer/keyboard lifecycle flows passed without retries:
  `.cache/tooltip-pointer-lifecycle.log`.
- Initial floating position styles use opacity 0. Geometry acceptance also waits for the
  positioned element's opacity 1 before measuring visible viewport containment.
  Starting popup content stays hidden until the primitive's initial positioning phase
  ends. Twelve repeated narrow/zoomed geometry and lifecycle cases passed in
  `.cache/tooltip-position-repeat.log`.
- Closed hint contents are hidden during Base UI's remaining unmount phase. This
  prevents stale accessible tooltip nodes while another hint opens; the strict browser
  role query reproduced two simultaneous nodes before the correction.
- Anchor focusability starts without a wrapper tab stop and resolves in layout effects.
  Dialog autofocus therefore chooses the native child rather than a temporary wrapper.
  Keyboard acceptance waits for that initial focus, then uses Tab and Shift+Tab.

## UI direction

Existing technical catalog for application developers, using token typography and the
green action accent. ENERGY 1 / RHYTHM 2 / MOTION 1. Named previews are the focal
points; controls expose component behavior. Chip tracks reserve space instead of
obscuring actions. Tooltip has one contrasting reading surface and an optional
directional arrow.

Screenshots inspected: `.cache/chip-desktop.png`, `.cache/chip-mobile.png`,
`.cache/tooltip-desktop.png`, and `.cache/tooltip-mobile.png`. The mobile views use
320px and 200% text. Long indicator values visibly shorten; complete names remain
accessible. Long hints wrap and scroll within the viewport rather than widening the
page.

## antislop delivery check

- R-01 PASS: no gradient or glow; solid tooltip contrast identifies the reading surface.
- R-02 PASS: new English public labels/docs use plain punctuation.
- R-03 PASS: 16 production geometry cases verify containment and enlarged text.
- R-04 PASS: menu chevrons indicate choices; tooltip arrow indicates its anchor.
- R-05 PASS: content is functional previews, without marketing filler sections.
- R-06 PASS: inherited product typography; monospace is only shortcut labeling.
- R-07 PASS: no decorative grid, dot background, or blueprint was added.
- R-08 PASS: action labels name operations without decorative arrows.
- R-09 PASS: marker values describe sample state; no promotional badge exists.
- R-10 PASS: surfaces are solid; no glass effect was introduced.
- R-11 PASS: token radii differ by control; dots identify passive state.
- R-12 PASS: inherited low shadows distinguish controls and the floating hint.
- R-13 PASS: focus outlines provide feedback; no decorative glow was added.
- R-14 PASS: controls follow the component's actual props, not equal feature cards.
- R-15 PASS: actions say Open sample messages or Run annotated action.
- R-16 PASS: references explain actual behavior without promotional AI claims.
- R-17 PASS: displayed counts are labeled sample data and derive from state.
- R-18 PASS: no testimonials or fabricated customer identities were introduced.
- R-19 PASS: no new animation; existing reduced-motion handling remains active.
- R-20 PASS: source-backed live previews serve the reacd component catalog.
- R-21 PASS: the existing two explicit light profiles remain selectable.
- R-22 PASS: existing labeled avatar placeholders are the only illustrative assets.
- R-23 PASS: navigation and placeholders retain their approved catalog purpose.
- R-24 PASS: strict MkDocs resolves the new pages and compiled source snippets.
- R-25 PASS: foreground/surface and intent pairs use contrast-validated template colors.
- R-26 PASS: examples test every selector/toggle and real local child action.
- R-27 PASS: hidden, disabled, automatic, controlled, dot/text and empty anchor cases
  pass.
- R-28 PASS: the references contain no generic FAQ filler.
- R-29 PASS: colors use the existing validated palette and one primary accent.
- R-30 PASS: views extend the existing reacd catalog structure.
- R-31 PASS: tracks, contrast, spacing, type and arrows have component-specific
  purposes.
- R-32 PASS: focus/tab order, Escape, disabled wrappers and dialog closure are tested.
- R-33 PASS: all behavior and styles are maintained source modules.
- R-34 PASS: both existing template profiles pass the browser matrix.
- R-35 PASS: built production CSS and controls pass local browser acceptance.
- R-36 PASS: no performance, security, customer or certification claim was added.
- R-37 PASS: the existing technical-catalog direction is recorded above.
- R-38 PASS: counts and identities explicitly describe local samples/placeholders.
- R-39 PASS: labels, native child controls, visible focus and passive semantics pass.
- R-40 PASS: reused Avatar reserves dimensions; no new media or remote scripts exist.
- DIALS PASS: ENERGY 1 / RHYTHM 2 / MOTION 1 matches the existing catalog.
- FOCUS PASS: each named preview presents the target component and its controls.
- SPACE PASS: token gaps separate controls; chip clearance protects child content.
- ACCENT PASS: the existing green primary action remains the deliberate accent.
- IDENTITY PASS: compiled TSX previews demonstrate reacd's closed authoring model.
- READ PASS: the technical catalog direction was retained before implementation.
- C-1 PASS: visible choices follow component behavior and the established token system.
- C-2 PASS: enabled actions have tested callbacks; shortcuts are documented as labels.
- C-3 PASS: no section exists beyond the documented component behavior.
- C-4 PASS: viewport, zoom, theme, keyboard, pointer and touch acceptance pass.
- C-5 PASS: the examples make no fabricated proof or adoption claims.

No commit, push, publication, deployment, or DNS change occurred. The existing large
demo-chunk warning and broader enterprise work remain in `specs/verification.md`.
