---
template: preview.html
reacd_preview: PageGrid
reacd_preview_height: 560
---

# PageGrid

PageGrid places page content into a responsive grid of aligned rows.

## Example

<!-- reacd-live-preview -->

```tsx
--8<-- "examples/page-grid.tsx"
```

## Properties

`children` accepts optional safe reacd content.

## Behavior and accessibility

The engine uses intrinsic track constraints and a maximum of three columns. Column count
reduces with available space; the template controls spacing. Applications provide no
grid classes, dimensions or breakpoint maps. Use PageColumns when content should flow
vertically through independent columns.

## Generative transport

Version 0.2 uses a required children array, which may be empty. The entire tree is
validated before rendering, including descendant state references and registered
actions. Styling hooks and native element nodes are rejected.
