---
template: preview.html
reacd_preview: PageList
reacd_preview_height: 560
---

# PageList

PageList displays page content as an ordered sequence of semantic list items.

## Example

<!-- reacd-live-preview -->

```tsx
--8<-- "examples/page-list.tsx"
```

## Properties

`children` accepts optional safe reacd content. `divide` is an optional boolean, false
by default.

## Behavior and accessibility

The adapter supplies native list-item wrappers and template-owned boundaries.
Application code supplies only reacd components. Null and boolean children are omitted.
Changing divide or appearance preserves child controls and their values. Item heights
remain intrinsic and long text wraps.

## Generative transport

Version 0.2 uses a required children array, which may be empty. The entire tree is
validated before rendering, including descendant state references and registered
actions. Styling hooks and native element nodes are rejected.
