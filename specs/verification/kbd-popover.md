# Kbd and Popover acceptance

Date: 2026-10-29. Scope: KBD-001 through KBD-006, POPOVER-001 through POPOVER-007,
and the retained-parent focus clarification in MODAL-008. This accepts two adapted
entries, not the full 132-entry enterprise inventory. The current public catalog has
43 components; 11 Nuxt entries have individual acceptance records.

## Requirements and evidence

| Requirement | Evidence |
| ----------- | -------- |
| KBD-001 | Own strict schema, named Props/function, negative public type tests |
| KBD-002 | Exact aliases, preserved literals, explicit platforms and labels |
| KBD-003 | Passive keyboard semantics, token variants, enlarged text wrapping |
| KBD-004 | Owned shadcn recipe, shared literal Tooltip presentation |
| KBD-005 | Text read bindings, constrained host writes and invalid values |
| KBD-006 | Packed TSX/SSR, schema, hydration, docs and browser containment |
| POPOVER-001 | Closed per-component contracts and complete adapter mapping |
| POPOVER-002 | Keyboard, touch, hover, focus return and modal focus wrapping |
| POPOVER-003 | Dismissal permissions, nested Escape scopes and cleanup |
| POPOVER-004 | Nearest portal hosts, available bounds, wrapping and scrolling |
| POPOVER-005 | Retained state, hidden ancestors and restored child focus |
| POPOVER-006 | Writable open binding, recursive footer validation and hydration |
| POPOVER-007 | Schema, types, coverage, package, docs and browser matrix |
| MODAL-008 | Retained parent autofocus defers to an already active child |

Tests live beside the schema, public component, adapter, renderer focus helper,
generative state, and compiled documentation modules. Existing state/table tests
continue to cover unique keys, typed permissions and atomic domain transitions.

Browser coverage in `demo/e2e/popover-kbd.spec.ts` has 21 cases: 16 geometry cases,
two field/layer/lifecycle flows, two hover/modal-focus flows and one touch case.
The matrix covers both templates, eight widths from 240 to 1920, long content,
logical variants, RTL and 200% text. Tooltip geometry also polls the unchanged
viewport constraints after automatic placement, with 12 repeated narrow cases.

The full check records 517 tests in 105 files and 100% per-file coverage for all
four categories across 303 measured executable files. Totals: 1847 statements,
1104 branches, 524 functions and 1709 lines. Empty declaration/barrel files do
not add executable coverage. All 114 Chromium cases, strict types/lint, source
policy, schema/example freshness, packed consumer and strict MkDocs pass.
Evidence: `.cache/popover-check.log`.

The full suite uses at most four Vitest workers. Unbounded default parallelism caused
several five-second interaction-test timeouts under workstation load. Assertion
timeouts, coverage scope and thresholds remain unchanged; the bounded full run passes
without automatic retries.

## Reproduced regressions and resolved behavior

- Retained parent reopening scheduled parent autofocus after its active Popover
  child mounted. That moved focus out and closed the child. The private initial
  focus resolver now defers to an open nested dialog. The original documented
  example and both browser profile flows reproduced the failure and now pass.
- Hover previews follow Nuxt's separate HoverCard behavior and stay non-modal.
  Nuxt's actual `Popover.vue` forwards modal only in click mode. The adapter
  therefore does not claim a modal hover focus trap.
- Modal focus guards receive focus before the primitive's scheduled focus wrap.
  Browser assertions check settled containment rather than the transient guard.
- Tooltip placement can update after the initial visible frame when long content
  changes available height. Geometry assertions retain the same tolerance and
  viewport bounds while waiting for automatic placement to complete. The original
  full-run observation and the corrected 12-case repetition are recorded locally.
- Interactive hover popup content explicitly restores pointer events inside the
  primitive's pointer bridge; fields and visible close actions remain usable.

Reference recipes and hashes are in `catalog/shadcn-provenance.json`. Nuxt Kbd,
Popover, `useKbd.ts`, `Popover.vue`, and shadcn Base recipes are cached in
`.cache/references/`. No vendor property escape enters the application API.

## UI direction and delivery gate

Established technical catalog for application developers. ENERGY 1 / RHYTHM 2 /
MOTION 1. Component previews are the focal points; existing green actions, named
controls and token spacing remain. Monospace denotes source. Native key glyphs
convey keyboard meanings, not decoration. No new visual brand was invented.

- R-02 PASS: English interface copy uses plain punctuation.
- R-03 PASS: geometry passes both profiles, eight widths, RTL and 200% text.
- R-17 PASS: no promotional statistics; sample action counts come from state.
- R-18 PASS: no testimonials or fictional customers were introduced.
- R-23 PASS: existing approved catalog name, navigation and templates are retained.
- R-24 PASS: both new MkDocs pages build in strict navigation with valid snippets.
- R-25 PASS: Kbd variants use contrast-validated template color pairs.
- R-26 PASS: preview controls, fields, save actions and dismissals are exercised.
- R-27 PASS: empty editor fallback and invalid bindings have tested behavior.
- R-28 PASS: no filler FAQ was added.
- R-32 PASS: keyboard activation, focus, nested Escape and modal wrapping pass.
- R-33 PASS: fixes live in maintained renderer/adapter source.
- R-34 PASS: spacious and compact profiles pass the matrix.
- R-35 PASS: production build and browser interaction checks pass locally.
- R-36 PASS: no certification or unmeasured performance claims were added.
- R-37 PASS: work extends the established technical catalog direction above.
- R-38 PASS: copy describes explicitly local examples and sample values.
- R-39 PASS: native controls, labels, passive keys, focus and touch are tested.
- R-40 PASS: no media, remote scripts or unmeasured performance figures added.
- R-01 PASS: no decorative gradients or glows were introduced.
- R-04 PASS: glyphs name keys; chevrons indicate existing menus.
- R-06 PASS: source typography retains its functional role.
- R-07 PASS: no background grid or blueprint was added.
- R-08 PASS: arrows appear only as meaningful key glyphs, not CTA decoration.
- R-09 PASS: no promotional badge or duplicate heading pill was added.
- R-10 PASS: panels use solid token surfaces, with no glass effect.
- R-12 PASS: popup shadow distinguishes a floating surface, not every item.
- R-13 PASS: focus outlines remain functional; no decorative glow was added.
- R-14 PASS: form layouts follow their field content, not feature-card symmetry.
- R-19 PASS: existing reduced-motion behavior remains; no timed animation added.
- R-22 PASS: no stock illustration was introduced.
- DIALS PASS: ENERGY 1 / RHYTHM 2 / MOTION 1 retained.
- FOCUS PASS: the current key and opened interactive panel are clear focal points.
- SPACE PASS: token spacing groups settings, preview, fields and footer actions.
- ACCENT PASS: existing primary action color is retained.
- IDENTITY PASS: executable component declarations and previews define the catalog.
- READ PASS: the established technical-catalog design read is recorded above.
- C-1 PASS: each addition serves notation, fields or dismissal behavior.
- C-2 PASS: every enabled action has tested local behavior.
- C-3 PASS: sections demonstrate the actual component contracts.
- C-4 PASS: lifecycle, keyboard, touch, profile and geometry checks pass.
- C-5 PASS: no invented customer or certification evidence appears.
- R-05 PASS: no marketing page template or filler sections were introduced.
- R-11 PASS: radii remain template tokens rather than uniform capsules.
- R-15 PASS: labels name actions such as Save local draft and Close popover.
- R-16 PASS: copy describes behavior without promotional AI language.
- R-20 PASS: live component settings and rendered behavior have a specific purpose.
- R-21 PASS: both existing light template profiles remain explicit choices.
- R-29 PASS: colors come from the validated template contract.
- R-30 PASS: additions extend the existing catalog rather than cloning another site.
- R-31 PASS: typography, spacing and surfaces reuse the established adapter system.

Inspected screenshots: `.cache/kbd-desktop.png`, `.cache/kbd-mobile.png`,
`.cache/popover-desktop.png`, `.cache/popover-mobile.png`. Mobile uses 200% text;
the popup scrolls within its viewport footprint. Private recipes, DOM, CSS and
focus resolution remain below the application boundary.

No commit, push, publication, deployment, hosting or DNS change was performed.
