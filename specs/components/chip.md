# Chip

CHIP-001: Provide separate named Props/schema/declaration/adapter modules and colocated
tests. A required nonempty label identifies the indicator. Optional text is bounded
string/numeric content. Logical intent, size, corner, inset, show, standalone, and safe
reacd children configure behavior. Native HTML, CSS, raw offsets, and slots are
rejected.

CHIP-002: The default indicator is a dot. Text/numeric indicators preserve their full
meaning through accessible labeling and a native title, even when compact display is
clamped. Values must be finite and bounded. A hidden indicator leaves children usable.
Standalone renders an indicator without requiring an artificial child.

CHIP-003: Support four logical corners and small/medium/large sizing. Reserve an edge
track rather than covering child content or using negative offsets. Inset aligns the
indicator with the content edge; the outside form reserves additional inline clearance.
This is an explicit safe adaptation of Nuxt's overlapping indicator, not arbitrary
application positioning. Large text and long values cannot widen the page or hide
actions.

CHIP-004: shadcn uses its existing private Badge presentation for text indicators and an
owned dot variant. Both use validated design tokens and semantic intent, without color
as the only source of meaning. Wrapping interactive children adds no artificial button
or tab stop. Labels, callback behavior, and state survive template changes.

CHIP-005: TSX values are host-controlled. Generative 0.2 supports literal props and an
optional read binding for show (boolean) and text (text/number), with host constraints.
Nested nodes use the same component/adapter. SSR and hydration preserve indicator and
child semantics; independent registries remain isolated.

CHIP-006: Require property/type/failure tests, exact adapter mapping, full per-file
coverage, independent portable schema validation, packed consumer SSR, hydration,
compiled docs, and browser geometry/interaction at both templates and 200% text.

References retrieved 2026-10-29:

- https://ui.nuxt.com/docs/components/chip
- https://ui.shadcn.com/docs/components/badge

Nuxt CSS masks, custom tags, classes, physical pixel sizes, and negative offsets stay
private. Logical corners replace physical left/right for RTL compatibility. Arbitrary
strings are safely shortened visually while the complete indicator meaning is retained.
