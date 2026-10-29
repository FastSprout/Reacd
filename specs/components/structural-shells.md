# Structural shells

Status: implemented locally; browser verification remains pending.

## Contract

SHELL-001: Container constrains readable width and applies template spacing. Main is a
main landmark which grows to consume shell space. Both accept only closed reacd
children; native tags and arbitrary styling fail validation.

SHELL-002: Footer exposes start, center children, end, top and bottom slots. Slots
reflow in document order without fixed content heights.

SHELL-003: Header exposes title, optional safe href and the same shell slots. Its
optional menu is controlled through open/onOpenChange, with modal, slideover and drawer
modes. Opening traps focus; Escape, close and outside interaction close it; closing
restores toggle focus. Header does not own state. Menu content and slots reject native
tags. Toggle and close names are nonempty.

SHELL-004: Separator supports horizontal/vertical orientation, semantic or decorative
presentation, start/center/end content position, solid/dashed/dotted lines,
neutral/primary/danger intent and small/medium/large size. Content accepts closed reacd
children or a label. When decorative, semantics are hidden.

SHELL-005: No application supplies tags, CSS classes, raw styles, breakpoints or
dimensions. Core policies own dimensions and defaults. The shadcn adapter owns native
markup and uses template tokens for appearance.

## Acceptance

- Strict schemas reject style injection, unsafe links, invalid callbacks and native slot
  nodes. Public consumer types derive from each component schema.
- All shells preserve supplied content and semantic landmarks in SSR and DOM.
- Header tests cover every mode, menu state, focus, Escape and close actions.
- Separator tests cover orientations, decorative semantics and labeled content.
- Examples compile as TSX and run through the public provider.
- Browser conformance checks narrow viewports and keyboard menu operation.
- Per-file runtime coverage is 100%; no runtime source exclusions are added.

## References and adaptation

- https://ui.nuxt.com/docs/components/container
- https://ui.nuxt.com/docs/components/main
- https://ui.nuxt.com/docs/components/header
- https://ui.nuxt.com/docs/components/footer
- https://ui.nuxt.com/docs/components/separator
- https://ui.shadcn.com/docs/components/separator

Retrieved locally 2026-10-29. Native `as`, class customization, arbitrary icons and
arbitrary UI maps are intentionally replaced by typed slots and template tokens.
Separator icons and avatars are composed through its children slot. Header's route
lifecycle belongs to the host: route changes set menu.open=false.

## Local verification, 2026-10-29

- Focused schema/adapter/theme tests: 11 files, 28 tests passed, workers=1.
- Focused compiled examples/public type tests: 11 files, 12 tests passed, workers=1.
  Header menu interaction preserves isolated Jotai state.
- Added browser conformance at 240/320/768/1440 viewport widths, menu Escape and focus
  restoration, document containment and a single main landmark. This suite awaits the
  coordinated catalog integration run.
- Main renders a section inside MainScopeContext; Page uses the same renderer-owned
  context to avoid duplicate main landmarks.
- Combined eight-component scoped coverage: 38 test files, 71 tests passed. All 48
  production files in that scope have 100% statements, branches, functions and lines.
  Report: .cache/coverage/layout-current/coverage-summary.json.
- Browser conformance now covers both templates, all three menu modes, LTR/RTL, long
  unbroken titles and 200% text sizing at all four widths. All-project checks and
  browser results await coordinated verification. Schema checks do not prove layout.
