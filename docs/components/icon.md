---
template: preview.html
reacd_preview: Icon
reacd_preview_height: 560
---

# Icon

Icon selects a semantic symbol from a closed adapter-owned map.

<!-- reacd-live-preview -->

```tsx
--8<-- "examples/icon.tsx"
```

Require a name: add, remove, close, check, search, info, warning, error, success,
settings, download, upload, external or loading. Provide a nonempty label for an
accessible image, or decorative:true without a label for decorative content.

Optional size is small, medium or large; medium is the default. The adapter maps sizes
to named policy dimensions. Icons inherit foreground color. Meaningful icons expose role
img and their label; decorative icons remain hidden from accessibility. Neither mode is
focusable or interactive.

Buttons and badges reuse these names beside visible text and render their symbols
decoratively. Use a real Button for an action. SVG markup, URLs, arbitrary package
names, styling props, native events and custom render functions are rejected.

Generative 0.2 accepts the same literal properties and enforces the same meaningful
versus decorative label rule before rendering.
