---
template: preview.html
reacd_preview: Main
reacd_preview_height: 560
---

# Main

Main identifies the primary application content and grows within an application shell.

## Example

<!-- reacd-live-preview -->

```tsx
--8<-- "examples/main.tsx"
```

## Properties

`children` accepts optional reacd content. Native elements and styling props fail
validation.

## Behavior and accessibility

Use one Main landmark per page. Main does not add a second title, constrain content
height, or own navigation. Use Container inside Main for readable width. Page already
supplies a main landmark, so avoid nesting Page within Main.

## Generative transport

Version 0.2 represents child slots as arrays of component nodes. Every slot is validated
recursively. Styling properties and native element names are rejected. The component
does not own application state or emit business actions.
