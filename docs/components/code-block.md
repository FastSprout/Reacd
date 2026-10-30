---
template: preview.html
reacd_preview: CodeBlock
reacd_preview_height: 560
---

# CodeBlock

Display source as readable text without executing it.

<!-- reacd-live-preview -->

```tsx
--8<-- "examples/code-block.tsx"
```

| Property  | Type     | Purpose                              |
| --------- | -------- | ------------------------------------ |
| `label`   | `string` | Accessible name for the code sample. |
| `content` | `string` | Bounded source content.              |

The renderer escapes source as text. Use CodeEditor for controlled editing.

Current 0.2 generative transport does not expose this component type. Use its TSX API;
this reference does not introduce a new JSON transport or deprecation.

Use the live TSX preview above to run this example. The adapter and template own HTML,
CSS and responsive rendering.
