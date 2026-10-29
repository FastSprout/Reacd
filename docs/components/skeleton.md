---
template: preview.html
reacd_preview: Skeleton
reacd_preview_height: 560
---

# Skeleton

Skeleton reserves space while content is loading. It is a visual placeholder, not a
progress indicator or a container for the content that will replace it.

## Example

The catalog runs this compiled example with logical shapes, sizes, line counts,
visibility and optional status announcements.

<!-- reacd-live-preview -->

```tsx
--8<-- "examples/skeleton.tsx"
```

## Properties

- `shape`: `text` (default), `avatar`, or `rectangle`.
- `size`: `small`, `medium` (default), or `large`.
- `lines`: one through eight, default three. Explicit line counts require text shape.
- `label`: optional nonempty loading status label. Omit it for decorative placeholders.
- `animated`: true by default; false keeps the placeholder static.
- `show`: true by default; false removes its visible and accessible footprint.

Sizes come from the engine and template. Text reserves line-height space; avatar uses a
circle constrained by available width; rectangle reserves a bounded content area. No raw
dimensions, classes, children or native attributes are exposed.

## Accessibility and motion

An unlabeled placeholder is hidden from the accessible tree. A labeled one is a loading
status with readable label text. Neither is a tab stop. Label a group once rather than
announcing every decorative shape in a loading composition. The live status itself is
not marked busy, so its message need not wait for loading to finish.

The pulse runs for at most 4.5 seconds and then stops. Reduced-motion preference
disables it. No input, click or progress behavior is implied by the animation.

## Generative UI and server rendering

Version `0.2` accepts a literal `show` boolean or a boolean state reference using
`mode: "read"`. A trusted host can finish loading by updating that key; the placeholder
does not write it. Unknown keys, incompatible kinds and write modes fail validation.

Server markup is deterministic. Hydration and template changes preserve application
state. Placeholders use the same shadcn adapter for TSX and generative declarations.
