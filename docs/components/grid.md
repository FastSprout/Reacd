---
template: preview.html
reacd_preview: Grid
reacd_preview_height: 560
---

# Grid

Arrange related components in an adaptive grid.

```tsx
<Grid columns={3} spacing="medium">
  <Card>
    <Text>Orders</Text>
  </Card>
  <Card>
    <Text>Customers</Text>
  </Card>
  <Card>
    <Text>Deliveries</Text>
  </Card>
</Grid>
```

## Properties

| Property   | Type                       | Purpose                   |
| ---------- | -------------------------- | ------------------------- |
| `columns`  | Bounded positive integer   | Maximum requested columns |
| `spacing`  | `small`, `medium`, `large` | Gap token                 |
| `children` | Component declarations     | Grid content              |

The requested column count is an upper bound. The renderer reduces columns when the
container cannot fit them, including inside nested layouts.

Applications do not provide media queries, device breakpoints, CSS grid tracks, or
per-screen class names.

## Runnable TSX example

<!-- reacd-live-preview -->

```tsx
--8<-- "examples/grid.tsx"
```

Use the live TSX preview above to run this example.
