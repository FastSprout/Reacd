# InputNumber

NUMBER-001: Expose controlled `number | null` value and a nullable numeric change
callback through a dedicated TSX module, Props type, and strict component schema. Null
means empty. Require a visible label. Reject styling, native event, and DOM props.
Accept a logical name, description, placeholder, required, disabled, and readOnly.
Disabled and read-only controls never emit value changes.

NUMBER-002: Accept finite min/max/step values within the safe numeric magnitude. Step is
positive; bounds are ordered; a nonempty value must be within bounds. Support
locale-aware decimal, percent, and currency entry through a closed format contract.
Locale defaults to en-US for deterministic SSR and hydration. Currency requires a
three-letter currency code. Fraction limits are ordered.

NUMBER-003: The shadcn adapter uses Base UI NumberField. Support stepping by buttons and
ArrowUp/ArrowDown, modified small/large steps, Home/End bounds, localized paste, decimal
arithmetic, transient incomplete input, blur clamping, required form validation, and
host rejection of writes. Buttons never submit. Stepping and formatting remain trusted
adapter behavior, not application CSS.

NUMBER-004: Generative 0.2 binds to nullableNumber state, preserving empty values
faithfully. Binding constraints protect finite numeric magnitude and range. Do not claim
that schema validation verifies browser layout or locale input.

NUMBER-005: Acceptance includes strict schema rejection, consumer types, real
interaction tests, isolated state binding, SSR/hydration, public examples, adapter
coverage, and browser keyboard/form/containment checks. Verification is recorded only
after checks execute, and four coverage categories must reach 100% per file.

References retrieved 2026-10-29:

- https://ui.nuxt.com/docs/components/input-number
- https://base-ui.com/react/components/number-field
- https://ui.shadcn.com/docs/components/base/input-group

Nuxt cosmetic orientation, button slots, and icon overrides belong to the theme adapter.
Uncontrolled defaults become host state. Out-of-range public values are rejected instead
of bypassing the contract through allow-invalid.
