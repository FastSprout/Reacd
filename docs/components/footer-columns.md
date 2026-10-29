---
template: preview.html
reacd_preview: FooterColumns
reacd_preview_height: 560
---

# FooterColumns

FooterColumns groups resource links under named columns. The adapter controls column
spacing and reflow; application code supplies only labels, targets and safe content.

## Example

<!-- reacd-live-preview -->

```tsx
--8<-- "examples/footer-columns.tsx"
```

## Properties

- `label`: required accessible name for the navigation landmark.
- `columns`: up to twelve keyed columns with a label and a `children` array.
- Each column contains up to 32 keyed links, actions or informational labels.
- A target uses either a safe `href` or `onPress`; callbacks receive no DOM event.
- `disabled` prevents an individual target from activating.
- `active` marks a native link as the current page.
- `newWindow` requires a link and uses `noopener noreferrer`.
- `left` and `right`: optional safe reacd content beside the columns.

Labels and links wrap. Empty columns remain valid and empty collections create no
phantom list items. Responsive columns reduce naturally as available width decreases.
Native list semantics and the declared reading order remain intact.

## Generative transport

Version `0.2` uses registered `action` names instead of callbacks. Optional left/right
slots are node arrays. All descendant actions are validated before rendering.

This React adaptation replaces Nuxt's `as`, icon and `ui` options with a closed
declaration and engine-owned semantics. A template adapter owns the final appearance.
