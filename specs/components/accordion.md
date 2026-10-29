# Accordion

ACCORDION-001: Provide a closed controlled TSX component with stable item values,
labels, component content, disabled items, and readonly open-value arrays. Single and
multiple modes share the same callback shape. No styling or native slots.

ACCORDION-002: Single mode opens at most one item. Non-collapsible single mode requires
one open item. Values must be unique and reference existing items. Duplicate item IDs,
unknown selections, invalid content, and extra props fail.

ACCORDION-003: The shadcn adapter uses the official new-york Accordion source. Headers
support Enter, Space, arrows, Home, and End through Radix primitives. Disabled controls
remain disabled. Panels have accessible heading relationships. Closed content unmounts
by default; retainContent preserves mounted descendants while making closed panels
hidden and non-interactive.

ACCORDION-004: Generative version 0.2 uses a writable selection-state binding for open
values. Item content is a recursive component declaration, including action and binding
validation. Changes preserve other app state and theme switches.

ACCORDION-005: Provide colocated schema, behavior, and type checks, per-file full
coverage, adapter conformance, portable schema, a compiled TSX documentation example,
and browser checks across both templates and the width/text-scale matrix.

ACCORDION-006: Retained closed sections deactivate descendant portals, including Select
menus and nested dialogs. Opening another section or changing host selection must not
leave hidden content interactive outside its panel. Controlled business values remain
unchanged; ancestor inactivity propagates through nested disclosure panels.

Reference behavior: https://ui.nuxt.com/docs/components/accordion, retrieved 2026-10-28.
CSS, arbitrary icon strings, native slots, Vue refs, and external drag integrations are
replaced by closed React composition and adapter-owned visuals. Nuxt permits
unmount-on-hide control, single/multiple, and disabled items. These behaviors remain
required here; an export alone does not accept the entry.
