# Accordion acceptance

Scope: ACCORDION-001 through ACCORDION-005, current shadcn adapter, 2026-10-28.
This accepts one required catalog entry, not the complete 132-entry inventory.

- ACCORDION-001 PASS: named AccordionProps and declaration module compile through
  the closed TSX runtime. The documented example runs in the component catalog.
- ACCORDION-002 PASS: colocated schema tests reject duplicate/missing IDs, invalid
  selections, excessive single selection, invalid children, and styling escapes.
- ACCORDION-003 PASS: adapter tests cover single/multiple, collapse, disabled
  triggers, retained hidden content, unmounted content, and keyboard navigation.
- ACCORDION-004 PASS: generative tests cover shared selection state, host writes,
  nested action validation, invalid initial selections, and missing bindings.
- ACCORDION-005 PASS: strict typing, typed lint, schema freshness, all adapter
  examples, portable schema, packed consumer SSR, and compiled docs passed.

## Commands and runtime evidence

- `npm run check`: passed; 337 tests and 18 Chromium scenarios.
- Per-file coverage: 210 instrumented runtime files, 100% in all four categories.
- `npm run typecheck`: includes the closed-TSX `docs/examples` project.
- `npm run test:package`: compiles and renders Accordion from the packed archive.
- `mkdocs build --strict`: passed; the component page returns local HTTP 200.
- Browser matrix: both profiles, eight widths from 240 to 1920, and 200% text.
- Browser interactions: retained note edits, hidden panel tab exclusion, disabled
  triggers, End navigation, Enter activation, and long-content containment.
- Inspected stable screenshots: `.cache/accordion-desktop.png` and
  `.cache/accordion-mobile.png`, with reduced motion enabled.

## UI delivery check

The existing technical-catalog direction and full delivery checklist in
[Generative state verification](generative-state.md) remain applicable. Dials
remain ENERGY 1 / RHYTHM 2 / MOTION 1.

- R-03 PASS: expanded panels stay contained in the browser width/text matrix.
- R-25 PASS: header, content, and disabled text use validated template colors.
- R-26 PASS: enabled triggers update controlled state; disabled triggers cannot.
- R-32 PASS: keyboard navigation and hidden-content tab exclusion passed.
- R-33 PASS: renderer CSS and adapter corrections are maintained source changes.
- R-35 PASS: production build, archive SSR, and browser interactions passed.
- R-39 PASS: named group, native buttons, heading relationships, and focus persist.
- C-1 PASS: panels group related content; chevrons communicate expansion state.
- C-2 PASS: the example's input and triggers have working state transitions.
- C-3 PASS: example copy demonstrates disclosure and state retention.
- C-4 PASS: both profiles, keyboard operation, disabled and collapsed states pass.
- C-5 PASS: examples contain no invented endorsements or production claims.

The public documentation includes its compiled source through MkDocs snippets.
The canonical domain remains configuration only. No remote publication occurred.

## Retained portal regression, 2026-10-29

ACCORDION-006 PASS: a new test reproduced an open Select menu surviving closure of its
retained section. The adapter now propagates active ancestry around each item's
content. The test passes for direct section closure and a closed Collapsible ancestor,
without emitting a business value change. The final combined check passed 364 unit
tests and 38 Chromium scenarios with full measured runtime coverage. Evidence and
current metrics are in [Collapsible acceptance](collapsible.md).
