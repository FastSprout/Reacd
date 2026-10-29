# Theme adapters

ADAPTER-100: Every usable adapter implements 100% of the public reacd catalog. There are
no optional component mappings, partial adapters, silent fallbacks, or design-system
substitutions for missing entries. This applies to both TSX declarations and JSON-driven
rendering, including future Nuxt UI catalog entries.

ADAPTER-101: Adding a reacd component breaks adapter compilation until every adapter
supplies its mapping. Runtime validation independently rejects missing, inherited,
extra, mismatched, and non-callable entries. Adapter conformance tests exercise every
mapping, including controlled state and documented error states.

ADAPTER-102: An adapter may explicitly reuse a design-neutral renderer utility. That
reuse is part of its declared implementation and is tested through that adapter.
Automatic lookup of a second adapter is forbidden.

ADAPTER-001: shadcn/ui is the first design-system adapter. MUI is a future integration
target and must not become a required dependency of the first implementation.

ADAPTER-002: An adapter is a rendering abstraction, not merely a palette or a CSS file.
It maps the closed reacd catalog to concrete design-system controls and surfaces.

ADAPTER-003: Application TSX remains unchanged when the selected adapter changes.
Application code imports reacd controls, never shadcn or MUI controls directly.

## Interface

The renderer owns the interface consumed by adapters. The adapter layer depends on that
interface and supplies the selected implementation to the state layer.

ADAPTER-004: The interface is typed per component. It does not erase props to `any`,
accept arbitrary component names, or expose vendor prop spreads publicly.

ADAPTER-005: Define capabilities explicitly. Shared structural renderers may be reused,
but every catalog entry must have an intentional implementation. Unsupported
capabilities fail clearly instead of silently changing libraries.

ADAPTER-006: Every adapter component has its own module. Adapter-specific styling and
vendor imports remain behind the adapter boundary.

## shadcn/ui integration

ADAPTER-007: Use official shadcn/ui component sources or documented primitives. Preserve
license attribution and record the upstream revision and local changes. Do not label an
unrelated CSS skin as a shadcn/ui adapter.

ADAPTER-008: Adapt unsafe stock defaults to reacd policies where necessary. Examples
include fixed heights, non-wrapping labels, small targets, and vendor escape hatches.
These adaptations belong to the trusted implementation.

ADAPTER-009: Utility classes used internally by shadcn/ui are implementation details.
They are not accepted in application TSX, JSON, or public props.

## Templates and state

ADAPTER-010: Templates configure appearance through validated tokens. The first
reference templates are a spacious SaaS design and a compact enterprise design.

ADAPTER-011: Template changes preserve structure, controlled values, selection,
validation state, and action semantics. Adapter changes must not reset business data
owned above the rendering boundary.

ADAPTER-012: Each adapter passes the same conformance suite. Passing the shared layout
tests alone does not establish correctness of its controls or overlays.

## Upstream references

- [shadcn/ui documentation](https://ui.shadcn.com/docs)
- [Manual installation](https://ui.shadcn.com/docs/installation/manual)
- [Upstream source](https://github.com/shadcn-ui/ui)
