---
template: preview.html
reacd_preview: Link
reacd_preview_height: 560
---

# Link

Link preserves native browser navigation while keeping targets and appearance bounded.

## Example

<!-- reacd-live-preview -->

```tsx
--8<-- "examples/link.tsx"
```

## Properties

Required `label` supplies visible text. Required `href` accepts application paths,
fragments, HTTP(S) destinations and mailto links. Unsafe schemes, control characters,
backslashes and protocol-relative URLs are rejected.

Optional `active` marks the current page. Optional `disabled` removes the destination
and keyboard activation while retaining the visible unavailable link. Optional
`newWindow` uses a new browsing context with `noopener noreferrer` protection.

## Behavior and accessibility

Enabled links retain browser copy-link, modified-click and open-in-tab behavior. The
host supplies active route state explicitly; reacd does not infer a router. Text wraps,
focus remains visible, and template tokens control appearance. There are no raw target,
rel, class, native event or inline style properties.

## Generative transport

Version 0.2 accepts the same properties with `type: "Link"`. It does not execute code or
bind arbitrary native events. Application authors use the same component in TSX.
