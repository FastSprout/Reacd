---
template: preview.html
reacd_preview: Navigation
reacd_preview_height: 560
---

# Navigation

Switch between a closed set of application views.

<!-- reacd-live-preview -->

```tsx
--8<-- "examples/navigation.tsx"
```

| Property        | Type                      | Purpose                          |
| --------------- | ------------------------- | -------------------------------- |
| `label`         | `string`                  | Accessible navigation label.     |
| `items`         | `readonly options`        | Unique value/label destinations. |
| `value`         | `string`                  | Current destination value.       |
| `onValueChange` | `(value: string) => void` | Request another destination.     |

The selected value must identify an item. Use Link for actual URL navigation.

Current 0.2 generative transport does not expose this component type. Use its TSX API;
this reference does not introduce a new JSON transport or deprecation.

Run `npm run dev` and choose **Navigation** to use this same compiled example. The
adapter and template own HTML, CSS and responsive rendering.
