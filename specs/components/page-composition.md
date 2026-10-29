# Page composition primitives

Status: accepted in Agent A's isolated workspace. See
specs/verification/agent-a-foundations.md for combined verification evidence.

## PageAside

PAGE-ASIDE-001: A complementary region has a required accessible label and safe top,
children and bottom slots. All content remains reachable in narrow layouts. A wide page
layout gives it sticky positioning, a policy-owned offset and a bounded scroll area. It
returns to document flow when narrow.

PAGE-ASIDE-002: Unlike Nuxt's default hidden mobile aside, reacd preserves navigation
availability. Applications do not configure breakpoints or heights. The adapter owns
reflow, scrolling and template spacing. This adaptation must be explicit in the public
reference; do not claim identical mobile hiding.

## PageBody

PAGE-BODY-001: PageBody supplies consistent block spacing for a page's main content. It
accepts safe children and does not introduce another main landmark. It does not
interpret HTML or Markdown strings as executable markup.

## PageColumns

PAGE-COLUMNS-001: PageColumns uses responsive multi-column content flow with an
engine-owned column width and a maximum of three columns. Column count adapts
intrinsically to available width; applications supply only children. Template spacing
controls gaps between columns and items.

PAGE-COLUMNS-002: Each child remains together when feasible; uneven item heights flow
independently. This is distinct from row-aligned PageGrid. The DOM reading and keyboard
order remains the original declaration order. Oversized content must remain reachable
instead of being clipped to simulate equal-sized cards. Null/boolean children must not
create empty visual items.

## PageGrid

PAGE-GRID-001: PageGrid places safe children in a row-aligned responsive grid with at
most three columns. It uses named engine track constraints and template spacing. At
narrow widths or large text it reduces the column count. It must not require application
breakpoint maps or low-level grid properties.

## PageList

PAGE-LIST-001: PageList presents children as a semantic vertical list in declaration
order. Its optional divide flag adds template-owned boundaries between items. Empty,
null and boolean children do not create phantom items. List item wrappers are owned by
the adapter, not supplied as native tags.

PAGE-LIST-002: Child action labels, disabled states and values are preserved when
boundaries or appearance change. Long text wraps and the list does not impose a fixed
item height or hide overflow.

## Shared contracts and acceptance

- Each component has its own strict schema, inferred Props, named public TSX function,
  shadcn entry, tests, public docs and compiled example.
- No as/className/style/native event/raw DOM rendering API is exposed.
- Every child and optional slot uses the same safe-content validation rules.
- Generative nodes use required children arrays; PageAside additionally has optional
  top/bottom arrays. The central visitor traverses every slot and validates action
  references before any partial UI renders.
- No component owns application state. Examples demonstrate actual Jotai state
  preservation through layout changes, rather than decorative controls.
- Schema and consumer tests reject unknown properties and native children.
- DOM/SSR tests verify aside naming, no duplicate main, list semantics, declaration
  order, null handling and preserved child actions/state.
- Browser tests exercise both templates at 240/320/768/1440 widths, 200% text and
  LTR/RTL. Direction must be scoped through App, not only document.dir; the preview must
  prove the effective native direction changes. They compare actual column geometry,
  grid row alignment, list separators, sticky/in-flow aside behavior, containment and
  keyboard reading order. Schema tests alone cannot establish layout correctness.
- Every production file requires 100% statement, branch, function and line coverage.
  Root integration owns the combined all-project verification gate.

## Primary references

- https://ui.nuxt.com/docs/components/page-aside
- https://ui.nuxt.com/docs/components/page-body
- https://ui.nuxt.com/docs/components/page-columns
- https://ui.nuxt.com/docs/components/page-grid
- https://ui.nuxt.com/docs/components/page-list

Documentation retrieved 2026-10-29 into .cache/references/. The documented default Grid
is one/two/three columns. Columns explicitly uses multi-column flow with
break-inside-avoid-column; it is not an alias for Grid. Nuxt's raw as/ui options are
replaced with closed semantic contracts and theme tokens.
