---
template: preview.html
reacd_preview: Container
reacd_preview_height: 560
---

# Container

Container constrains content to a readable template width and supplies safe inline
spacing.

## Example

<!-- reacd-live-preview -->

```tsx
--8<-- "examples/container.tsx"
```

## Properties

`children` accepts optional reacd content. Native elements and styling props fail
validation.

## Behavior and accessibility

Container uses an intrinsic height and wraps long content. Its maximum width and spacing
belong to the engine and active template. Compose it inside Main when a page needs a
centered content region.

## Generative transport

Version 0.2 represents child slots as arrays of component nodes. Every slot is validated
recursively. Styling properties and native element names are rejected. The component
does not own application state or emit business actions.
