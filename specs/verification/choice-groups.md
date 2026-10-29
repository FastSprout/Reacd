# RadioGroup and CheckboxGroup acceptance

Scope: RADIO-001 through RADIO-006 and CHECKGROUP-001 through CHECKGROUP-006.
Current shadcn adapter, 2026-10-29. This accepts two required catalog entries, not
the complete 132-entry inventory or enterprise objective.

- RADIO-001 PASS: named Props/declaration/schema modules compile. Schema tests reject
  missing/duplicate options, invalid values/callbacks, and styling escapes.
- RADIO-002 PASS: descriptions, disabled flags, required, generated/explicit names,
  orientation, and rejected controlled proposals are exercised by adapter tests.
- RADIO-003 PASS: labels, linked descriptions, arrow selection/wrapping, disabled-item
  skipping, Space, checked state, and Tab exit pass unit/browser interaction tests.
- RADIO-004 PASS: native required forms reject empty submissions and accept selected
  values. Disabled groups stop blocking submission. SSR hydration retains generated
  relationships and keeps later client state separate from server snapshots.
- RADIO-005 PASS: shared writable text bindings update both groups and a display.
  Missing/wrong/read-only definitions and unknown initial/live values fail. Host
  updates may explicitly select disabled values; UI interaction remains disabled.
- RADIO-006 PASS: strict types, exact adapter map, portable schema, per-file coverage,
  packed consumer SSR, compiled docs, and production browser gates passed.
- CHECKGROUP-001 PASS: readonly selection/callback types and named modules compile.
  Duplicate/missing IDs, invalid max/value/callbacks, and uncontrolled escapes fail.
- CHECKGROUP-002 PASS: labels/descriptions, disabled items/groups, names, required,
  orientations, and maximum selection are represented in the closed contract.
- CHECKGROUP-003 PASS: labels and Space toggle complete selections; max prevents
  additions but preserves focusable aria-disabled controls. Unchecking releases
  capacity. Disabled selected choices remain unchanged by user input.
- CHECKGROUP-004 PASS: native forms reject empty required groups, accept a subset,
  and accept disabled groups. Hydration and independent generated names are tested.
- CHECKGROUP-005 PASS: shared selection state respects every active max/membership
  constraint. Invalid host writes preserve previous values. Explicit host updates
  add/remove disabled selections without granting those controls edit permissions.
- CHECKGROUP-006 PASS: schema/type/failure, full coverage, adapter, portable schema,
  archive SSR, hydration, docs, and production browser acceptance passed.

## Commands and artifacts

- `npm run check`: exit 0; log `.cache/choice-check.log`.
- 385 unit tests across 60 files passed.
- 243 measured runtime files have per-file 100% coverage; 100 empty files are skipped.
- Statements 1390/1390, branches 819/819, functions 438/438, lines 1270/1270.
- CLI runner line coverage remains outstanding and is not included in these metrics.
- 56 Chromium scenarios passed, including 18 new choice-group scenarios.
- New matrix: both profiles, widths 240 through 1920, both orientations, long labels
  and descriptions, checked indicator containment, 44 px targets, and 200% text.
- Enlarged-text tests scroll later choices into the viewport to verify reachability.
- Interaction flows cover required/disabled forms, keyboard, max, and theme retention.
- Packed consumer compiles and renders both public components with selected values.
- Strict MkDocs embeds the exact compiled examples; both local component routes are 200.
- Inspected `.cache/radio-group-desktop.png` and `.cache/radio-group-mobile.png`.
- Inspected `.cache/checkbox-group-desktop.png` and `.cache/checkbox-group-mobile.png`.
- Images show Spacious desktop and Compact at 320 px with 200% text/reduced motion.

Source provenance is recorded in `catalog/shadcn-provenance.json`. RadioGroup follows
the Base UI shadcn recipe; CheckboxGroup composes its checkbox recipe with Base UI's
group primitive. Registry icon placeholders and arbitrary vendor props are not public.

## UI delivery check

The full technical-catalog direction/checklist in
[Generative state verification](generative-state.md) remains applicable.
Dials remain ENERGY 1 / RHYTHM 2 / MOTION 1.

- R-03 PASS: descriptions, labels, and selected markers remain bounded in the matrix.
- R-25 PASS: content and indicators use validated template foreground/background pairs.
- R-26 PASS: choices, orientation/disable toggles, submit, and clear are exercised.
- R-32 PASS: arrow/Space/Tab interactions, disabled skipping, and max-focus behavior
  pass in Chromium; focus uses the existing engine outline.
- R-33 PASS: all behavior and geometry are maintained source modules.
- R-35 PASS: production assets, packed consumers, and complete interactive flows pass.
- R-39 PASS: native inputs, named groups, legends, linked descriptions, required form
  semantics, policy targets, and disabled/checked states are verified.
- Purpose PASS: circular radio markers distinguish exclusive choices from checkboxes.
  Spacing separates options; group legends/descriptions establish reading hierarchy.
  Active/disabled indicators use the host's existing theme and state vocabulary.
- Liveliness PASS: the named choice task supplies the focal point, with structural
  spacing and the existing restrained accent consistent with the technical catalog.
- C-1 PASS: arrangement follows exclusive and multiple selection tasks.
- C-2 PASS: every added control works or exposes a tested disabled/limited state.
- C-3 PASS: examples demonstrate controlled state, validation, and long identifiers.
- C-4 PASS: both profiles, orientation changes, widths, keyboard, and text scale pass.
- C-5 PASS: no fabricated customer, performance, or compliance claims were added.

The reacd catalog now contains 37 components, including additional reacd primitives.
That count is not the number of individually accepted Nuxt entries. Full catalog,
documentation, CLI coverage, and broader platform acceptance remain outstanding.
No commit, push, publication, deployment, or DNS change occurred.
