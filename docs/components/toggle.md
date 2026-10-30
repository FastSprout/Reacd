---
template: preview.html
reacd_preview: Toggle
reacd_preview_height: 560
---

# Toggle

Request a boolean preference change.

<!-- reacd-live-preview -->

```tsx
--8<-- "examples/toggle.tsx"
```

| Property          | Type                       | Purpose                      |
| ----------------- | -------------------------- | ---------------------------- |
| `label`           | `string`                   | Accessible switch label.     |
| `checked`         | `boolean`                  | Authoritative preference.    |
| `onCheckedChange` | `(value: boolean) => void` | Request a new boolean value. |
| `disabled`        | `boolean?`                 | Block activation.            |

Callbacks receive boolean values. Application state remains the source of truth.

Optional generative transport retains the corresponding closed logical contract.

Use the live TSX preview above to run this example. The adapter and template own HTML,
CSS and responsive rendering.
