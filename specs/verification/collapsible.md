# Collapsible acceptance

Scope: COLLAPSIBLE-001 through COLLAPSIBLE-006, ACCORDION-006, and RENDER-013.
Current shadcn adapter, 2026-10-29. This accepts one required inventory entry and two
renderer regressions, not the complete 132-entry inventory or enterprise scope.

- COLLAPSIBLE-001 PASS: named props, explicit function declaration, closed schemas,
  native/style rejection, adapter mapping, and packed public exports compile.
- COLLAPSIBLE-002 PASS: native button type, named/linked region, Enter/Space, disabled
  triggers, programmatic opening, and rejected controlled requests are tested. Adapter
  callbacks emit exactly one boolean argument.
- COLLAPSIBLE-003 PASS: default unmount loses descendant-local state; retained content
  preserves it while hidden and excluded from Tab. Tests cover menu disposal, nested
  dialog inactivity, and nested disclosure state across ancestor closure.
- COLLAPSIBLE-004 PASS: long nested identifiers pass both profiles and eight widths,
  240 through 1920, including compact containers and 200% text. Browser tests preserve
  edited note/role values and nested open state across profile changes.
- COLLAPSIBLE-005 PASS: shared writable boolean state reacts to trigger, external
  control, and host updates. Missing/wrong/read-only definitions fail validation.
  Recursive actions are validated while closed. Portable JSON Schema accepts the node.
- COLLAPSIBLE-006 PASS: unit/type/schema, coverage, archive consumer, strict docs, and
  browser gates passed. The catalog runs the same compiled source embedded in docs.
- ACCORDION-006 PASS: a regression test failed against the original retained panel
  implementation. Active ancestry now closes descendant menus on section or ancestor
  closure without changing controlled values.
- RENDER-013 PASS: original Toggle geometry failed after visual inspection showed
  an escaping thumb at 200% text. Named policy now controls track ratio, minimum size,
  and inset. The production browser matrix checks both states, LTR/RTL, and 200% text.

## Commands and artifacts

- `npm run check`: exit 0; full log `.cache/collapsible-check.log`.
- 364 unit tests across 49 files passed.
- 227 measured runtime files have per-file 100% coverage; 95 empty files are skipped.
- Statements 1300/1300, branches 769/769, functions 403/403, lines 1186/1186.
- CLI runner line coverage remains outstanding; it is not included in those metrics.
- 38 Chromium scenarios passed, including two new full disclosure interaction flows.
- Existing width/text matrix now opens both disclosure levels and checks Toggle thumbs.
- Packed consumer renders open and retained closed panels in Node SSR.
- Strict MkDocs includes compiled example source; local component route returns 200.
- Inspected `.cache/collapsible-desktop.png` and `.cache/collapsible-mobile.png`.

During Toggle correction, production CSS optimization removed an individual translate
reset when paired with transform:none. A targeted browser check caught the mismatch
between development and production. The independent reset survives optimization; the
final full suite runs against built production assets. No retry or tolerance increase
was used to conceal the defect.

## UI delivery check

The full technical-catalog direction/checklist in
[Generative state verification](generative-state.md) remains applicable.
Dials remain ENERGY 1 / RHYTHM 2 / MOTION 1.

- R-03 PASS: nested labels/content stay contained in the width/text matrix.
- R-25 PASS: text and controls use the existing validated template color pairs.
- R-26 PASS: triggers, shared toggle, note, role, and reset have tested actions.
- R-32 PASS: Enter/Space, visible focus, disabled controls, and hidden-content Tab skip
  pass in Chromium; retained child portals deactivate in regression tests.
- R-33 PASS: behavior is implemented in maintained engine/adapter source.
- R-35 PASS: built archive and production browser interactions passed.
- R-39 PASS: native non-submit buttons, expanded/control relationships, named regions,
  labeled fields, and policy-sized targets are verified.
- Purpose PASS: a chevron communicates disclosure; grouped spacing separates editable
  settings. Theme typography/colors retain the host's technical-catalog direction.
- Liveliness PASS: the active panel is the focal point; gaps, the existing accent,
  and repeated disclosure affordances support the declared dials.
- C-1 PASS: layout follows disclosure/editing tasks rather than decorative cards.
- C-2 PASS: every added example control has exercised state changes or is disabled.
- C-3 PASS: source and preview demonstrate state sharing, nesting, and retention.
- C-4 PASS: tested profiles, widths, text scale, directions, and keyboard paths pass.
- C-5 PASS: no invented customer, performance, or compliance claims were added.

The public catalog now contains 35 components, including extra reacd primitives.
This is not a claim that 35 Nuxt inventory entries have passed individual acceptance.
No commit, push, publication, deployment, or DNS change occurred.
