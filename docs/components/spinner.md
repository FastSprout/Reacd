---
template: preview.html
reacd_preview: Spinner
reacd_preview_height: 560
---

# Spinner

Announce that work remains in progress.

<!-- reacd-live-preview -->

```tsx
--8<-- "examples/spinner.tsx"
```

| Property | Type     | Purpose                 |
| -------- | -------- | ----------------------- |
| `label`  | `string` | Meaningful status text. |

The label is announced as status content. Supply real progress context, not a timer.

Current 0.2 generative transport does not expose this component type. Use its TSX API;
this reference does not introduce a new JSON transport or deprecation.

Run `npm run dev` and choose **Actions and feedback** to use this same compiled example.
The adapter and template own HTML, CSS and responsive rendering.
