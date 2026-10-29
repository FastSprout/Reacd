---
template: preview.html
reacd_preview: Chip
reacd_preview_height: 560
---

# Chip

Chip adds a named value or status indicator to another component, or displays it alone.
The engine reserves space at the chosen edge. The indicator never covers the wrapped
component's label or action target.

## Example

The catalog runs this compiled example. Counts and identities are explicitly sample
data.

<!-- reacd-live-preview -->

```tsx
--8<-- "examples/chip.tsx"
```

## Properties

- `label`: required nonempty accessible indicator name.
- `text`: optional string or finite number within the safe integer magnitude range.
  Omitting it displays a dot. Zero remains a visible value.
- `intent`: `primary` (default), `secondary`, or `danger`.
- `size`: `small`, `medium` (default), or `large`.
- `corner`: `top-start`, `top-end` (default), `bottom-start`, or `bottom-end`.
- `inset`: false by default; aligns the indicator with the content edge.
- `standalone`: false by default; true displays only the indicator and rejects children.
- `show`: true by default; false hides the indicator while preserving child actions.
- `children`: optional reacd content, without native elements or styling escapes.

Start/end follow the document's text direction. The outside form reserves additional
inline clearance. Both forms use an edge track rather than overlapping child content.
This deliberate adaptation keeps long labels and enlarged text from covering actions.

## Accessibility and state

The indicator exposes its label and complete value as an accessible image name and a
native title. Compact text can use an ellipsis, while its full meaning remains
available. Color supplements the label. Wrapping a button adds no artificial button or
tab stop; the original action and focus behavior remain intact.

The shadcn adapter uses its private Badge recipe for text, plus an owned dot variant.
Token profiles supply all presentation values. Invalid values, native children, unknown
properties, or standalone children produce diagnostics.

Version `0.2` accepts literal properties or `read` bindings for `text` (text/number) and
`show` (boolean). It cannot write through those bindings. Host updates validate active
indicator constraints before committing. SSR/hydration preserve identities and child
content, with separate state registries per application or request.
