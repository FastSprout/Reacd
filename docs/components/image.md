---
reacd_preview: Image
---

# Image

Display an image with a source and an accessible description.

<!-- reacd-live-preview -->

```tsx
--8<-- "examples/image.tsx"
```

Place your own image in the application's public directory, for example
`public/images/product.jpg`, and use `/images/product.jpg` as its source.
HTTP(S) image URLs are also supported. Credentials and unsafe URL schemes are
rejected.

| Property | Type | Purpose |
| --- | --- | --- |
| `src` | `string` | Required image URL |
| `alt` | `string` | Required accessible description |
| `aspect` | `landscape`, `square`, `portrait` | Reserved proportions |

The adapter reserves space before loading and keeps the complete image visible
inside its container. Landscape is the default. Loading exposes a busy state;
failed images keep their accessible description and display `Image unavailable`.
Changing the source starts a new loading lifecycle.
Error feedback wraps and grows with its content, including at enlarged text sizes.

Use [ColorModeImage](color-mode-image.md) when light and dark appearances need
different image sources.
