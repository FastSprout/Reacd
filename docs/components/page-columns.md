---
template: preview.html
reacd_preview: PageColumns
reacd_preview_height: 560
---

# PageColumns

PageColumns arranges uneven content through responsive multi-column flow.

## Example

<!-- reacd-live-preview -->

```tsx
--8<-- "examples/page-columns.tsx"
```

## Properties

`children` accepts optional safe reacd content.

## Behavior and accessibility

The engine derives one to three columns from available space. Content flows down each
column in declaration order, while child blocks avoid splitting when possible. DOM
reading and keyboard order remain the declaration order. This differs from PageGrid,
which aligns cards into rows. Null and boolean children create no empty items.

## Generative transport

Version 0.2 uses a required children array, which may be empty. The entire tree is
validated before rendering, including descendant state references and registered
actions. Styling hooks and native element nodes are rejected.
