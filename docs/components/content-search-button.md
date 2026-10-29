---
template: preview.html
reacd_preview: ContentSearchButton
reacd_preview_height: 560
---

# ContentSearchButton

ContentSearchButton asks the host to open its documentation search.

## Example

<!-- reacd-live-preview -->

```tsx
--8<-- "examples/content-search-button.tsx"
```

Use it with ContentSearch when the host owns a search dialog. The standalone example
shows only the request contract; the button does not create a dialog by itself.

## Properties and behavior

Required `open` and `onOpenChange` describe the host's visibility state. Optional
`label` defaults to `Search documentation`. Optional `disabled` blocks activation.
Pointer, Enter and Space request `onOpenChange(true)`, without exposing native events.
The button announces dialog expansion. It does not invent a global keyboard shortcut.

Version 0.2 generative transport replaces the callback with a writable boolean `open`
reference. Rejected writes show a diagnostic, and successful recovery clears it.
