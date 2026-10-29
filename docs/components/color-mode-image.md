---
template: preview.html
reacd_preview: ColorModeImage
reacd_preview_height: 560
---

# ColorModeImage

An accessible image with separate sources for resolved light and dark modes.

<!-- reacd-live-preview -->

```tsx
--8<-- "examples/color-mode.tsx"
```

```tsx
<ColorModeImage
  alt="Workspace overview"
  mode={resolvedMode}
  light="/workspace-light.svg"
  dark="/workspace-dark.svg"
  aspect="landscape"
/>
```

Required alt identifies the image. Mode is explicitly light or dark. Both sources must
be HTTP(S) or root-relative URLs without credentials. Logical aspect is landscape
(default), square or portrait. Intrinsic dimensions reserve space before loading; the
image scales within its container without cropping.

Loading retains the accessible name and marks the image busy. Failure displays a text
fallback. Source changes reset that lifecycle. Generative mode is a resolved literal or
read text binding and cannot write application state.

The compiled [color-mode example](../examples/color-mode.tsx) uses explicit workspace
illustrations to demonstrate palette-aware assets.
