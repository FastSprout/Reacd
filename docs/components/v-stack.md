---
template: preview.html
reacd_preview: VStack
reacd_preview_height: 560
---

# VStack

Arrange declarations in vertical reading order.

<!-- reacd-live-preview -->

```tsx
--8<-- "examples/v-stack.tsx"
```

| Property   | Type                     | Purpose          |
| ---------- | ------------------------ | ---------------- |
| `children` | `declarations`           | Ordered content. |
| `spacing`  | `small / medium / large` | Named gap token. |

Content can grow naturally. The engine owns geometry, overflow and gap resolution.

Optional generative transport retains the corresponding closed logical contract.

Run `npm run dev` and choose **Layout** to use this same compiled example. The adapter
and template own HTML, CSS and responsive rendering.
