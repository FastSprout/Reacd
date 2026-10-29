---
template: preview.html
reacd_preview: Footer
reacd_preview_height: 560
---

# Footer

Footer composes application support information into a responsive shell.

## Example

<!-- reacd-live-preview -->

```tsx
--8<-- "examples/footer.tsx"
```

## Properties

`children` is the center slot. `start`, `end`, `top` and `bottom` accept optional reacd
content.

## Behavior and accessibility

The footer is a contentinfo landmark. Slots retain their document order when wrapping.
The template controls spacing and borders. Links and actions remain ordinary reacd
components, with their own validated callbacks and keyboard behavior.

## Generative transport

Version 0.2 represents child slots as arrays of component nodes. Every slot is validated
recursively. Styling properties and native element names are rejected. The component
does not own application state or emit business actions.
