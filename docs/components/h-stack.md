---
template: preview.html
reacd_preview: HStack
reacd_preview_height: 560
---

# HStack

Arrange related declarations along the horizontal layout intent.

<!-- reacd-live-preview -->

```tsx
--8<-- "examples/h-stack.tsx"
```

| Property   | Type                     | Purpose          |
| ---------- | ------------------------ | ---------------- |
| `children` | `declarations`           | Related content. |
| `spacing`  | `small / medium / large` | Named gap token. |

The engine reflows narrow content. Application views do not set flex or breakpoints.

Optional generative transport retains the corresponding closed logical contract.

Use the live TSX preview above to run this example. The adapter and template own HTML,
CSS and responsive rendering.
