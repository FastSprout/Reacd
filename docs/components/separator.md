---
template: preview.html
reacd_preview: Separator
reacd_preview_height: 560
---

# Separator

Separator expresses a boundary between related groups of content.

## Example

<!-- reacd-live-preview -->

```tsx
--8<-- "examples/separator.tsx"
```

## Properties

`orientation`: `horizontal` (default) or `vertical`. `position`: `start`, `center`
(default), `end`. `lineStyle`: `solid` (default), `dashed`, `dotted`. `intent`:
`neutral` (default), `primary`, `danger`. `size`: `small` (default), `medium`, `large`.
`decorative`: false by default. `label` supplies optional text; `children` composes
optional reacd content, such as Avatar.

## Behavior and accessibility

A semantic separator exposes its orientation. Decorative separators are omitted from the
accessibility tree. Label takes precedence when both label and children are supplied.
Content wraps safely. Vertical separators stretch within a bounded parent and retain a
minimum visible extent. Use a horizontal separator between stacked content groups.

## Generative transport

Version 0.2 represents child slots as arrays of component nodes. Every slot is validated
recursively. Styling properties and native element names are rejected. The component
does not own application state or emit business actions.
