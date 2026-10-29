---
template: preview.html
reacd_preview: Switch
reacd_preview_height: 560
---

# Switch

A controlled on/off setting with a visible label, native form data and semantic
validation. The shadcn adapter owns its track, thumb, direction and focus rendering.

<!-- reacd-live-preview -->

```tsx
--8<-- "examples/switch.tsx"
```

```tsx
<Switch
  label="Publish updates"
  checked={published}
  onCheckedChange={setPublished}
  name="publish"
  required
/>
```

Space, Enter, pointer and label activation request a new boolean. The host remains
responsible for accepting that request. `readOnly` and `loading` preserve focus and
canonical form data while preventing writes. Loading announces the supplied setting; the
host owns the actual asynchronous operation.

`name` serializes the configured `value` only while checked and enabled. The submitted
value defaults to `on`. Required unchecked settings block native submission and focus
the visible switch. Read-only required settings still need valid host data. Disabled
settings are excluded from validation and FormData.

FormField supplies default name/required state, descriptions and controlled errors.
Explicit name/required props override those defaults. Field-level disabled state always
wins. The switch keeps its own label; the field's optional caption labels the group.

| Prop                      | Contract                                          |
| ------------------------- | ------------------------------------------------- |
| label                     | Required visible label                            |
| checked / onCheckedChange | Controlled boolean and typed callback             |
| description               | Optional accessible supporting text               |
| name / value              | Logical form name and submitted text              |
| required                  | Require checked state for submission              |
| disabled / readOnly       | Prevent editing; only disabled omits data         |
| loading                   | Host-controlled busy state with progress feedback |

Generative transport binds `checked` to boolean state with explicit read or readWrite
access. Read bindings behave as read-only controls. No HTML, classes, styling props, DOM
events or uncontrolled defaults are exposed.

The compiled [Switch example](../examples/switch.tsx) covers required submission,
read-only state and host-controlled loading.
