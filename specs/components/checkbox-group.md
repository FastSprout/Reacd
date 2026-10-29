# CheckboxGroup

CHECKGROUP-001: Provide a separate named Props/schema/TSX module. Require label, unique
stable string-valued items, controlled readonly string-array value, and a callback
receiving the complete readonly next selection. Reject duplicates, missing option IDs,
unsafe props, and selections exceeding max. Empty selection is valid editing state.

CHECKGROUP-002: Items have visible labels, optional descriptions, and disabled flags.
Support group description, disabled, required, logical name, optional positive integer
max, and vertical/horizontal orientation. Horizontal groups wrap without breakpoints.
Cosmetic options remain adapter/template concerns. Disabled selected items remain
selected until a host update changes them.

CHECKGROUP-003: Compose the shadcn Base UI Checkbox recipe through CheckboxGroup. Space
and label clicks toggle individual values. At max, unchecked items cannot activate but
remain focusable with aria-disabled; selected enabled items can be unchecked to release
capacity. Render a visible maximum hint. Callbacks contain values only, never events.
Controlled hosts may reject a proposed next selection.

CHECKGROUP-004: Required means at least one choice before native form submission, not
every item. Disabled groups do not block submission. Name and instance-generated IDs
keep independent groups isolated and support SSR hydration.

CHECKGROUP-005: Generative 0.2 binds value to writable selection state. Membership,
uniqueness, and max constraints validate initial and live host writes. Several groups
can share a key while their simultaneous constraints remain satisfied. Invalid
writes leave prior state intact. A host may change disabled selections explicitly.

CHECKGROUP-006: Require schema/type/interaction/failure tests, per-file 100% coverage,
complete adapter mapping, portable schema, packed-consumer SSR, hydration, compiled
documentation, and browser keyboard/form/limit/containment tests across both profiles
and the width/200% text matrix.

References retrieved 2026-10-29:

- https://ui.nuxt.com/docs/components/checkbox-group
- https://ui.shadcn.com/docs/components/base/checkbox
- https://base-ui.com/react/components/checkbox-group

The Nuxt 4.12 reference includes max selection with focusable aria-disabled options.
Its value/label/description paths normalize to explicit item fields. CSS, native slots,
raw icons, and uncontrolled defaults become adapter ownership and host-owned state.
