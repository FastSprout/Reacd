---
template: preview.html
reacd_preview: Textarea
reacd_preview_height: 560
---

# Textarea

Edit controlled multiline text with bounded automatic height and native form behavior.
The dedicated `Textarea` module adds semantic validation and FormField integration. The
earlier basic `TextArea` component remains available during migration.

<!-- reacd-live-preview -->

```tsx
--8<-- "examples/textarea.tsx"
```

```tsx
<Textarea
  label="Release notes"
  value={notes}
  onValueChange={setNotes}
  autoResize
  rows={2}
  maxRows={6}
  maxLength={1000}
/>
```

Automatic height grows and shrinks using the rendered text, width and font metrics. It
stays between `rows` and `maxRows`, then scrolls internally to keep longer text
reachable. Disabling automatic height restores manual vertical resizing. Focus and
selection survive measurement; application code supplies no pixel sizes.

Minimum length constrains submission, rather than preventing incomplete drafts. Empty
optional text remains valid. `required` separately rejects an empty value. Maximum
length constrains both editing and generative host-state writes. Lengths count UTF-16
code units, matching native text controls.

Read-only fields retain their FormData and required/minimum validation. If required host
data is missing, the host must fix it; the control does not pretend to offer editing.
Disabled controls are excluded. Validation feedback appears after attempted submission
and clears when the controlled value becomes valid.

| Prop                           | Contract                                         |
| ------------------------------ | ------------------------------------------------ |
| label                          | Required visible field label                     |
| value / onValueChange          | Controlled text and typed callback               |
| description / placeholder      | Supporting text and empty-field hint             |
| name                           | Optional native form data key                    |
| required / disabled / readOnly | Logical form behavior                            |
| minLength / maxLength          | Ordered integers from 0 to 10,000                |
| rows / maxRows                 | Ordered integers from 1 to 30; defaults 3 and 30 |
| autoResize                     | Measure content height within row limits         |

FormField supplies default names/required flags, descriptions, errors and inherited
disabled safety. Explicit name/required props override defaults. No native events, HTML,
styling props or uncontrolled values are accepted.

Generative transport binds text with explicit read/readWrite access. A read binding
makes the field read-only. Maximum-length constraints apply to shared host writes;
minimum length stays a submission rule so editing remains possible.

The compiled [Textarea example](../examples/textarea.tsx) includes automatic/manual
height, protected editing and content longer than the row cap.
