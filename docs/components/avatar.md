---
template: preview.html
reacd_preview: Avatar
reacd_preview_height: 560
---

# Avatar

Avatar displays one identity using an image or a text fallback. The adapter owns image
loading, fallback visibility, dimensions, and accessible naming. Application code uses
logical props without image attributes or CSS.

## Example

The component catalog runs this compiled TSX example. Its images are local placeholders,
not real profile photographs.

<!-- reacd-live-preview -->

```tsx
--8<-- "examples/avatar.tsx"
```

## Properties

| Property   | Type                         | Default            |
| ---------- | ---------------------------- | ------------------ |
| `name`     | Nonempty string              | Required           |
| `src`      | HTTP(S) or root-relative URL | Omitted            |
| `fallback` | One or two Unicode graphemes | Generated initials |
| `size`     | `small`, `medium`, `large`   | `medium`           |

The full name remains the accessible label and native title even when the fallback shows
initials. The image is decorative inside this labeled identity, avoiding duplicate
announcements. Small, medium, and large use engine-owned dimensions that scale with text
size.

## Loading and fallback

The fallback appears while an image loads or when decoding fails. Successfully loaded
images replace it. Changing `src` starts a new load; changing `name` updates the label
and generated initials. The square footprint stays stable throughout those transitions.
Images load lazily and use a no-referrer policy.

Initials use the first and last word, or the first two graphemes of a single word. Emoji
and combining characters stay intact. An explicit fallback can contain up to two
graphemes. Invalid names, unsafe protocols, credentials, or styling props produce
validation diagnostics rather than arbitrary markup.

## Generative UI and rendering

Version `0.2` supports `Avatar` with the same identity props. These are literal
properties, rather than state bindings in this transport version. Hosts can replace the
declaration; TSX hosts can pass reactive values directly.

Server rendering and hydration retain the accessible identity and fallback. Rendering
the component does not fetch image bytes on the server. Tooltip and Chip are separate
catalog components; Avatar does not accept arbitrary content slots.
