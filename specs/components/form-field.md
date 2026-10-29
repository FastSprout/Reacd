# FormField

Status: specified for the named Form catalog batch. Existing Form submission is
unchanged.

FORM-FIELD-001: Provide a dedicated FormFieldProps, strict schema, TSX declaration and
shadcn adapter for a logical validation scope. Require a stable name and safe children.
Accept optional group label, description, hint, help, error, required and disabled.
Empty error text clears feedback; nonempty trimmed error text marks the field invalid.
No DOM IDs, CSS, native tags, regex execution, render callbacks or child prop cloning
are exposed. Child controls retain their own explicit labels; a group caption is
optional to avoid duplicate visible labels for a single control.

FORM-FIELD-002: Render a semantic fieldset with optional legend and required indicator.
Description appears before controls; help follows controls. Error replaces help while
invalid, announces feedback and becomes an accessible description of the logical field
and participating controls. Hint belongs to the group caption area and wraps safely.
Name is a logical validation/data key, never a CSS or DOM selector.

FORM-FIELD-003: Trusted renderer metadata carries only logical name, required/disabled,
invalid/error text and generated description IDs. An explicit control name overrides the
field name; otherwise name inherits. Explicit control required overrides the field
default. Disabled combines with OR, so a control cannot re-enable a disabled field.
Nested scopes inherit required defaults and disabled safety, use their nearest name,
merge description/error IDs without duplicates and preserve outer validation errors.
Keep application state and callbacks outside this metadata context.

FORM-FIELD-004: Controlled field errors block native form submission even when an
individual control would otherwise be valid. Invalid submission focuses the first
visible, enabled associated control through a field-scoped ref. Never query or mutate
the global document. Ignore hidden native form bridges, disabled controls and hidden
ancestors. If no eligible control exists, focus the logical group so its error remains
reachable. Disabled scopes are omitted from validation and native FormData.

FORM-FIELD-005: Switch/Textarea in this batch consume the metadata contract. Remaining
Form controls adopt it in their respective enterprise batches. Independently labelled
existing controls may still be grouped, but automatic control-level metadata inheritance
must not be claimed until their adapter is integrated. Read-only controls preserve
semantic required validation; only disabled scopes are excluded.

FORM-FIELD-006: Generative 0.2 has safe recursive children and the same logical
metadata. Error may be literal text or an explicit read-only reference to text state;
empty text means no error. Validate binding kinds/access before rendering an interactive
scope. Business validation writes error state outside the renderer. Host/SSR stores
remain isolated. State updates clear errors without remounting controls or losing their
values.

FORM-FIELD-007: Existing Form onSubmit():void stays compatible. Central Form
schema/state validation and AuthForm integration require a separate reviewed contract.
This batch does not add native events to public onSubmit or introduce a second
application store. The separate trusted FormScope guard owns nested-form rejection.

FORM-FIELD-008: Acceptance includes closed schemas/types, feedback precedence,
description ID association, inherited/explicit flags and names, nested disabled safety,
native validity/focus and fallback, disabled omission, literal/state error transitions,
SSR/hydration, independent stores and both-template responsive browser behavior. Require
100% per-file statement/branch/function/line coverage and compiled TSX examples. Do not
infer browser accessibility from schema validity or DOM unit geometry.

Primary references checked 2026-10-29:

- https://ui.nuxt.com/docs/components/form-field
- https://ui.nuxt.com/docs/components/form
- https://ui.shadcn.com/docs/components/base/field

Arbitrary error regexes and vendor sizing/style props are not copied. A future central
Form contract may associate nested error paths using closed matching policies. This
initial field scope accepts explicit controlled feedback and stable logical names.
