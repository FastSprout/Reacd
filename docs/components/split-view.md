---
template: preview.html
reacd_preview: SplitView
reacd_preview_height: 560
---

# SplitView

Place related regions in a responsive split layout.

<!-- reacd-live-preview -->

```tsx
--8<-- "examples/split-view.tsx"
```

| Property   | Type                     | Purpose          |
| ---------- | ------------------------ | ---------------- |
| `children` | `declarations`           | Content regions. |
| `spacing`  | `small / medium / large` | Named gap token. |

SplitView is a layout primitive. Use Splitter for controlled resize state.

Current 0.2 generative transport does not expose this component type. Use its TSX API;
this reference does not introduce a new JSON transport or deprecation.

Use the live TSX preview above to run this example. The adapter and template own HTML,
CSS and responsive rendering.
