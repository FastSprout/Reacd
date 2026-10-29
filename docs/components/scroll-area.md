---
template: preview.html
reacd_preview: ScrollArea
reacd_preview_height: 560
---

# ScrollArea

ScrollArea contains a labelled collection or region without making the page itself
scroll sideways. Native scrolling keeps wheel, touch and keyboard behavior.

## Example

<!-- reacd-live-preview -->

```tsx
--8<-- "examples/scroll-area.tsx"
```

## Properties

- `label`: required accessible region name.
- `orientation`: `vertical` (default) or `horizontal`.
- `extent`: `small`, `medium` (default) or `large` policy bounds.
- `children`: optional safe reacd content.

The scroll viewport is keyboard-focusable; nested fields and actions retain their own
focus behavior. Vertical content wraps, while horizontal content uses bounded tracks
inside the viewport. Templates control spacing and borders.

The adapter composes Base UI ScrollArea according to the shadcn recipe. It shows a
scrollbar when content overflows. Its closed API does not expose raw dimensions, DOM
handles, scrolling callbacks or virtualization. All bounded children remain available to
assistive technology and server rendering.

## Generative UI

Version `0.2` uses a recursively validated array for `children`. Each child keeps its
own state bindings and registered action references. The scroll region itself does not
own or mutate application state.
