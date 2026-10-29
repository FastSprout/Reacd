---
template: preview.html
reacd_preview: ProgressGroup
reacd_preview_height: 560
---

# ProgressGroup

ProgressGroup divides one track into labelled segments, such as storage usage by
category. A mandatory textual legend preserves meaning without relying on color.

## Example

<!-- reacd-live-preview -->

```tsx
--8<-- "examples/progress-group.tsx"
```

## Properties

- `label`: required accessible progressbar name.
- `items`: required nonempty array of `{id, label, value, intent?}`.
- `max`: optional positive finite capacity; defaults to `100`.
- `showStatus`: show the aggregate and capacity; defaults to `true`.

Item identifiers must be unique. Intent is `primary` (default), `secondary` or `danger`.
Values are finite numbers clamped between zero and capacity. Overfull segments share the
track proportionally; the accessible aggregate stops at max. Each legend row reports its
own clamped value and the capacity.

Long labels wrap and the legend reflows. Templates control colors and density;
applications cannot pass dimensions, native elements or styles. The trusted adapter
implements this segmented extension of the shadcn Progress recipe.

## Generative UI

Version `0.2` accepts a `ProgressGroup` leaf with the same literal item data. For
changing allocations, update TSX state or replace a validated declaration. The component
does not invent a special state kind or write application data.
