---
template: preview.html
reacd_preview: Checkbox
reacd_preview_height: 560
---

# Checkbox

Choose a controlled boolean option with native form data, required validation and a
separate mixed-state indicator. The adapter owns geometry, labels, indicator and focus.

<!-- reacd-live-preview -->

```tsx
--8<-- "examples/checkbox.tsx"
```

```tsx
<Checkbox
  label="Approve selected accounts"
  checked={allApproved}
  indeterminate={partiallyApproved}
  onCheckedChange={approveSelection}
  name="approval"
  required
/>
```

Checked remains boolean. `indeterminate` displays mixed state without changing that
value. Activating mixed state requests true; the host updates its aggregate selection
and clears its mixed flag. The component does not silently mutate derived host state.
The compiled example performs both host writes explicitly.

Space, pointer and label activation request exactly one boolean argument. The host can
decline a write. Read-only prevents changes but stays focusable and keeps canonical
data; disabled prevents editing and omits data/validation. Enter follows native checkbox
semantics, rather than invoking an unrelated action.

Only checked, non-mixed, enabled state serializes `name` and configured `value` (default
`on`). Mixed/unchecked required state blocks native submission and focuses the visible
checkbox. Read-only required data must still be valid; the host must fix missing data.

FormField provides default name/required flags, descriptions and controlled errors.
Explicit name/required props override defaults. Inherited disabled always wins. Native
labels remain visible and unchanged; generated description IDs are merged once.

| Prop                      | Contract                                            |
| ------------------------- | --------------------------------------------------- |
| label                     | Required visible label                              |
| checked / onCheckedChange | Controlled boolean and typed callback               |
| indeterminate             | Host-controlled mixed indicator                     |
| description               | Optional accessible guidance                        |
| name / value              | Logical form key and submitted text                 |
| required                  | Require checked, non-mixed state                    |
| disabled / readOnly       | Protect editing; only disabled omits canonical data |

Generative transport binds checked to boolean state with explicit read/readWrite access.
Read bindings force readonly. Indeterminate accepts literal boolean or a read-only
boolean-state reference. The host owns aggregation; a checked write never implicitly
writes to the mixed-state reference. Independent host/SSR stores remain isolated.

No native events, HTML, CSS, uncontrolled defaults or vendor tri-state objects are
public. The compiled [Checkbox example](../examples/checkbox.tsx) includes mixed-state
approval, a readonly reader, native submission, protection and scoped RTL.
