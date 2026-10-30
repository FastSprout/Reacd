---
template: preview.html
reacd_preview: CodeEditor
reacd_preview_height: 560
---

# CodeEditor

Edit bounded source text through a controlled value.

<!-- reacd-live-preview -->

```tsx
--8<-- "examples/code-editor.tsx"
```

| Property        | Type                      | Purpose                        |
| --------------- | ------------------------- | ------------------------------ |
| `label`         | `string`                  | Accessible editor label.       |
| `value`         | `string`                  | Authoritative source text.     |
| `onValueChange` | `(value: string) => void` | Request the next source value. |

Editing does not execute code or imply JSON validation. The host owns the value.

Current 0.2 generative transport does not expose this component type. Use its TSX API;
this reference does not introduce a new JSON transport or deprecation.

Use the live TSX preview above to run this example. The adapter and template own HTML,
CSS and responsive rendering.
