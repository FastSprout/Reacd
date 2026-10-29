---
template: preview.html
reacd_preview: PageBody
reacd_preview_height: 560
---

# PageBody

PageBody supplies consistent block spacing for the main content of a page.

## Example

<!-- reacd-live-preview -->

```tsx
--8<-- "examples/page-body.tsx"
```

## Properties

`children` accepts optional safe reacd content.

## Behavior and accessibility

PageBody adds no main landmark and does not parse HTML or Markdown strings. Compose
Text, CodeBlock, forms and other reacd components for content. Field values remain in
the surrounding isolated Jotai store when appearance changes.

## Generative transport

Version 0.2 uses a required children array, which may be empty. The entire tree is
validated before rendering, including descendant state references and registered
actions. Styling hooks and native element nodes are rejected.
