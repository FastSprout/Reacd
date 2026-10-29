# RadioGroup

RADIO-001: Provide a separate named Props/schema/TSX module. Require group label, unique
stable string-valued items, controlled string value, and onValueChange(string). Empty
string means no selection. Nonempty values must reference an item. Items have labels,
optional descriptions, and disabled flags. Reject unknown props and native/style slots.

RADIO-002: Support group description, disabled, required, logical name, and vertical or
horizontal orientation. Orientation defaults to vertical; horizontal content wraps
automatically. Cosmetic variant, size, icon, and indicator customization belong to the
adapter/template, not application props. Controlled host logic may reject changes.

RADIO-003: The shadcn adapter follows its Base UI Radio Group recipe. Exactly one item
can be selected. Arrow keys move selection and focus, skip disabled items, and wrap.
Space selects the focused item. Labels activate their items. Expose a named radiogroup,
visible legend, descriptions, and checked/disabled states without browser events.

RADIO-004: Empty required groups block native form submission until a choice is made.
Disabled groups do not block submission. Instance-generated names isolate unnamed
groups. SSR IDs hydrate consistently. Buttons/indicators cannot accidentally submit.

RADIO-005: Generative 0.2 binds value to writable text state, including empty selection.
Reference/permission and option-membership constraints validate before rendering and
apply to host writes. Shared readers/writers update reactively. No invalid host write
may leave a group with a missing selected option.

RADIO-006: Require schema/type/interaction/failure tests, per-file 100% coverage, exact
adapter mapping, portable schema, archive SSR, hydration, compiled documentation,
and browser keyboard/form/containment checks at both profiles and 200% text.

References retrieved 2026-10-29:

- https://ui.nuxt.com/docs/components/radio-group
- https://ui.shadcn.com/docs/components/base/radio-group
- https://base-ui.com/react/components/radio-group

Nuxt value/label/description paths normalize to the closed item contract. Uncontrolled
defaults become host-owned state. Arbitrary markup/icons and local styling are excluded
by the application boundary; descriptions, disabled choices, orientation, required, and
single selection remain behavioral requirements.
