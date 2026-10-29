---
template: preview.html
reacd_preview: Banner
reacd_preview_height: 560
---

# Banner

Banner presents an application notice with optional actions and controlled dismissal.
Its visibility belongs to the host state, including any persistence.

## Example

<!-- reacd-live-preview -->

```tsx
--8<-- "examples/banner.tsx"
```

## Properties

- `title`: required nonempty notice title.
- `description`: optional supporting text.
- `open`: required controlled visibility.
- `onOpenChange`: required callback receiving the next boolean visibility.
- `intent`: `info` (default), `success`, `warning` or `error`.
- `dismissible`: whether to render a close button; defaults to `false`.
- `closeLabel`: optional close text; defaults to `Dismiss banner`.
- `actions`: optional reacd components with their own typed behavior.

Closing requests `false`; the banner stays visible until the host updates open. Info and
success use status semantics. Warning and error use alert semantics. Titles,
descriptions and actions wrap without a fixed panel height. Native markup, arbitrary
styles and DOM events are rejected at the declaration boundary.

## Generative UI

Version `0.2` requires a boolean state reference with `mode: "readWrite"` for `open`.
`actions` is an optional recursively validated array of declarations. Registered action
names resolve through the host. Independent stores isolate visibility, and SSR does not
read or write global browser storage.
