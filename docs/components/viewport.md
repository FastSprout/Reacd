---
template: preview.html
reacd_preview: Viewport
reacd_preview_height: 560
---

# Viewport

Preview content in the existing regular or compact container.

<!-- reacd-live-preview -->

```tsx
--8<-- "examples/viewport.tsx"
```

| Property   | Type           | Purpose                          |
| ---------- | -------------- | -------------------------------- |
| `compact`  | `boolean`      | Explicit container preview mode. |
| `children` | `declarations` | Preview content.                 |

This flag selects a preview constraint. Component reflow still belongs to the engine.

Current 0.2 generative transport does not expose this component type. Use its TSX API;
this reference does not introduce a new JSON transport or deprecation.

Run `npm run dev` and choose **Layout** to use this same compiled example. The adapter
and template own HTML, CSS and responsive rendering.
