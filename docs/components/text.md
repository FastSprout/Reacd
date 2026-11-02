---
reacd_preview: Text
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

`headline` and `subheadline` create headings within the current section scope.
`display` emphasizes metrics without adding a heading to the document outline.

## Long content

```tsx
<Text lineLimit={2}>{description}</Text>
```

Text wraps within its container. A line limit adds a **Full text** disclosure.
Open it with a pointer, Enter or Space to read the complete content. The selected
adapter uses its native disclosure control and keeps the text in one layout item.

The template supplies typography. Application views do not choose HTML heading tags,
arbitrary font sizes, or CSS overflow rules.

## Runnable TSX example

<!-- reacd-live-preview -->

```tsx
--8<-- "examples/text.tsx"
```

Use the live TSX preview above to run this example.
