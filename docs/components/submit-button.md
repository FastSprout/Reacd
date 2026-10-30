---
template: preview.html
reacd_preview: SubmitButton
reacd_preview_height: 560
---

# SubmitButton

Submit its enclosing reacd Form through native form semantics.

<!-- reacd-live-preview -->

```tsx
--8<-- "examples/submit-button.tsx"
```

| Property   | Type                           | Purpose              |
| ---------- | ------------------------------ | -------------------- |
| `label`    | `string`                       | Visible action text. |
| `intent`   | `primary / secondary / danger` | Logical emphasis.    |
| `disabled` | `boolean?`                     | Block activation.    |

Place this control inside Form. Form owns validation, submission and protection.

Optional generative transport retains the corresponding closed logical contract.

Use the live TSX preview above to run this example. The adapter and template own HTML,
CSS and responsive rendering.
