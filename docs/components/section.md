---
template: preview.html
reacd_preview: Section
reacd_preview_height: 560
---

# Section

Group content under an accessible heading and optional anchor.

<!-- reacd-live-preview -->

```tsx
--8<-- "examples/section.tsx"
```

| Property      | Type           | Purpose                          |
| ------------- | -------------- | -------------------------------- |
| `title`       | `string`       | Visible heading and region name. |
| `description` | `string?`      | Supporting context.              |
| `anchor`      | `identifier?`  | Semantic fragment destination.   |
| `children`    | `declarations` | Section content.                 |

The renderer owns heading depth and native IDs. An anchor supports real links.

Optional generative transport retains the corresponding closed logical contract.

Use the live TSX preview above to run this example. The adapter and template own HTML,
CSS and responsive rendering.
