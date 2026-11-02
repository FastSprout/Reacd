---
reacd_preview: CodeEditor
---

# CodeEditor

## Adapter availability

CodeEditor currently has no native mapping in either bundled adapter. This page records
its closed TSX contract. Its preview reports an explicit unsupported component error
until a verified SDK integration is available.

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

The displayed TSX source declares the intended controlled behavior. A supported adapter
implementation must own native editing, styling and responsive rendering.
