# ProgressGroup

PROGRESS-GROUP-001: Provide a segmented progress bar with a required accessible label
and a bounded nonempty list of uniquely identified items. Each item has a label, finite
value and optional semantic intent. Optional positive finite max defaults to 100;
optional showStatus defaults true. All numbers use named policy limits. Styling, tags,
native events and arbitrary presentation are rejected.

PROGRESS-GROUP-002: Values are clamped into [0,max]. If clamped values exceed max,
segments share the complete track proportionally. Otherwise their total width is
total/max. Zero values do not divide by zero. An accessible progressbar reports clamped
aggregate value; a visible textual legend lists each segment's label and clamped value
so color is never the only source of meaning. Status reports the aggregate and maximum.
Legend content wraps at narrow widths.

PROGRESS-GROUP-003: The shadcn adapter owns this segmented extension of the existing
Progress design recipe. It uses logical dimensions and inherits validated design tokens.
It exposes no CSS or dimensions to applications. Generative transport supports the same
literal segmented values. Dynamic transport can replace a validated document; no new
state kind is invented.

PROGRESS-GROUP-004: Acceptance tests cover defaults, all intents, optional status,
underfilled, full, overfull, negative and zero values, duplicate identity rejection,
schema transport and independent safe adapter rendering. Require per-file 100% coverage,
compiled docs, SSR/hydration and browser geometry for both templates. Schema validation
does not prove actual geometry.

PROGRESS-GROUP-005: The runnable preview provides scoped App direction. RTL conformance
activates the context and asserts computed progressbar direction; document.dir alone may
be overridden by a nested primitive provider.

References retrieved 2026-10-29:

- https://ui.nuxt.com/docs/components/progress-group
- https://ui.shadcn.com/docs/components/progress

Nuxt accepts arbitrary custom colors and styling. reacd uses semantic intent and a
mandatory legend; the accessible aggregate clamps without losing item data.
