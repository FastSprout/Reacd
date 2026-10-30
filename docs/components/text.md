---
template: preview.html
reacd_preview: Text
reacd_preview_height: 560
---

# Text

Display content with a logical role and safe layout behavior.

```tsx
<Text role="headline">Orders</Text>
<Text>Review current orders and delivery details.</Text>
```

## Properties

| Property    | Type                       | Purpose                          |
| ----------- | -------------------------- | -------------------------------- |
| `children`  | `string` or `number`       | Content to display               |
| `role`      | Logical text role          | Meaning in the content hierarchy |
| `weight`    | `normal`, `medium`, `bold` | Logical emphasis                 |
| `lineLimit` | Positive bounded integer   | Limit visible lines              |

Available roles are `headline`, `subheadline`, `body`, `caption`, and `display`.

## Long content

```tsx
<Text lineLimit={2}>{description}</Text>
```

Text wraps within its container. A line limit retains a way to access the full content
rather than silently discarding it.

The template supplies typography. Application views do not choose HTML heading tags,
arbitrary font sizes, or CSS overflow rules.

## Runnable TSX example

<!-- reacd-live-preview -->

```tsx
--8<-- "examples/text.tsx"
```

Use the live TSX preview above to run this example.
