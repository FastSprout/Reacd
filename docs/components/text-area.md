---
template: preview.html
reacd_preview: TextArea
reacd_preview_height: 560
---

# TextArea

Edit a controlled multiline text value using the existing TextArea API.

<!-- reacd-live-preview -->

```tsx
--8<-- "examples/text-area.tsx"
```

| Property        | Type                      | Purpose                        |
| --------------- | ------------------------- | ------------------------------ |
| `label`         | `string`                  | Accessible field label.        |
| `value`         | `string`                  | Authoritative text.            |
| `onValueChange` | `(value: string) => void` | Request updated text.          |
| `placeholder`   | `string?`                 | Optional empty-field guidance. |
| `required`      | `boolean?`                | Native required validation.    |
| `disabled`      | `boolean?`                | Block editing.                 |
| `rows`          | `bounded integer?`        | Logical visible row count.     |

TextArea remains supported. Textarea is the separate Nuxt-aligned component API.

Current 0.2 generative transport does not expose this component type. Use its TSX API;
this reference does not introduce a new JSON transport or deprecation.

Use the live TSX preview above to run this example. The adapter and template own HTML,
CSS and responsive rendering.
