# Tree

TREE-001: Provide a closed, named TSX component for bounded hierarchical data. Each node
has a unique id, nonempty label, optional disabled state and optional nonempty children.
Reject cycles, excessive depth/count, duplicate identities, unknown selected/expanded
ids, duplicate state entries and styling/native events. Selected and expanded ids are
controlled readonly arrays with typed callbacks. Single selection is default; multiple
selection is an explicit logical mode. Separate selectionReadOnly and expansionReadOnly
flags preserve navigable data when a transition is unavailable. Only branch ids may be
expanded. Empty top-level data displays a named empty state.

TREE-002: A labelled tree exposes visible flat treeitems with explicit level, position,
sibling count, selected, disabled and branch-expanded semantics. Collapsed descendants
are absent. Focus and selection are separate. One enabled visible item participates in
tab order; initial focus prefers selected content. An empty or entirely disabled tree
remains a named focusable region. Row and disclosure activation request host transitions
without mutating props.

TREE-003: Implement WAI treeview navigation in the trusted shadcn adapter. Up/Down,
Home/End move focus without selecting. Forward arrow expands a closed branch or moves to
its first child; backward collapses or focuses its parent. Forward/backward arrows
follow App direction. Enter/Space select; multiple mode toggles membership without
modifier keys. Typeahead moves among enabled visible labels with a named reset interval.
Disabled items never activate; keyboard navigation skips them. Tab remains native.
Disclosure buttons have explicit labels and are excluded from the tree's roving tab
sequence. When reached directly by assistive technology, disclosure keyboard activation
must not also select its parent row.

TREE-004: Use existing shadcn Button and validated template tokens. Indentation has a
named cap so deep trees preserve text and action width. Labels wrap, focus stays
visible, and disclosure targets retain the shared minimum touch size. No application
HTML, CSS, DOM event or arbitrary renderer is exposed.

TREE-005: Generative 0.2 uses selection-kind state references for selected and expanded
ids, each with explicit read or readWrite access. Read bindings render disabled
interactions for their respective transition while preserving keyboard focus. Validate
initial and subsequent ids against the declared tree and mode. Independent host stores
and SSR requests remain isolated.

TREE-006: Acceptance covers strict schema/type failures, structural budgets, all
keyboard and pointer transitions, disabled/readonly states, typeahead, controlled host
rejection, branch removal, literal transport shape, state constraints/isolation, both
templates and SSR/hydration. Every runtime file requires four-category 100% coverage.
Actual browser geometry, RTL and scrolling remain separate acceptance evidence, never
inferred from schema checks.

TREE-007: Preflight bounds pending allocation before reading array members. Reject an
array larger than the remaining node budget without visiting its elements. The root and
each children collection must contain node objects, never nested arrays. Inspect at most
the configured node count and depth before recursive validation. Preserve cycle
detection and reject repeated object identities. Acceptance includes sparse oversized
arrays with throwing element getters and deeply nested array-only input.

References retrieved 2026-10-29:

- https://ui.nuxt.com/docs/components/tree
- https://www.w3.org/WAI/ARIA/apg/patterns/treeview/
- https://ui.shadcn.com/docs/components/button

Base UI 1.9 has no public Tree primitive. This owned shadcn composition implements the
WAI pattern; optional virtualization, propagation and arbitrary slots are outside this
closed contract and are not claimed as upstream feature parity.
