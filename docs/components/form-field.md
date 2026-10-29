---
template: preview.html
reacd_preview: FormField
reacd_preview_height: 560
---

# FormField

Group a logical form value with accessible guidance and controlled validation feedback.
FormField supplies metadata to participating controls without cloning child elements or
changing their visible labels.

<!-- reacd-live-preview -->

```tsx
--8<-- "examples/form-field.tsx"
```

```tsx
<FormField name="notes" label="Review details" error={notesError} required>
  <Textarea label="Account notes" value={notes} onValueChange={setNotes} />
</FormField>
```

`name` is a stable logical data key. Participating controls inherit it unless they
supply an explicit name. Explicit control `required` overrides the field default.
Disabled combines with OR: a child cannot re-enable a disabled field. Nested scopes
retain outer errors/descriptions and use the nearest name.

Description appears before controls. Help follows them until a nonempty trimmed error
replaces it. Error feedback is announced and associated with controls through generated
IDs. Empty error text clears it. Hint provides supplementary group guidance. The
optional group label becomes a legend; each child keeps its own native label.

Controlled errors block native form submission. Invalid submission focuses the first
visible enabled control inside the field. A field without an eligible control receives
focus itself. Disabled fields omit their controls from native validation and FormData.
Read-only controls retain semantic required validation.

| Prop                      | Contract                                          |
| ------------------------- | ------------------------------------------------- |
| name                      | Required stable logical field key                 |
| children                  | Required safe reacd content                       |
| label                     | Optional group caption                            |
| description / hint / help | Associated supporting text                        |
| error                     | Controlled feedback; empty text clears it         |
| required                  | Default required state for participating controls |
| disabled                  | Disable the entire field scope                    |

Switch and Textarea consume the metadata contract in this batch. Other existing controls
can be grouped and receive native fieldset disabling, but automatic name, required and
description inheritance requires integration by their own adapters.

Optional generative transport accepts recursive children. `error` may be literal text or
a read-only text-state reference. Business validation updates that state outside the
renderer. Error updates preserve child identity, focus and canonical values. Form's
existing `onSubmit(): void` contract remains compatible.

The compiled [FormField example](../examples/form-field.tsx) demonstrates inherited
flags, controlled server-style feedback, native submission and scoped RTL layout.
