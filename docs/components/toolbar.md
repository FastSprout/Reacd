---
template: preview.html
reacd_preview: Toolbar
reacd_preview_height: 560
---

# Toolbar

Group related actions under one accessible name.

<!-- reacd-live-preview -->

```tsx
--8<-- "examples/toolbar.tsx"
```

| Property   | Type           | Purpose                      |
| ---------- | -------------- | ---------------------------- |
| `label`    | `string`       | Accessible group name.       |
| `children` | `declarations` | Actions and related content. |

This existing primitive is a named action group; it adds no custom keyboard model.

Current 0.2 generative transport does not expose this component type. Use its TSX API;
this reference does not introduce a new JSON transport or deprecation.

Use the live TSX preview above to run this example. The adapter and template own HTML,
CSS and responsive rendering.
