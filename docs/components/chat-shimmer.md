---
template: preview.html
reacd_preview: ChatShimmer
reacd_preview_height: 560
---

# ChatShimmer

ChatShimmer displays complete status text with a finite decorative underline pulse.

## Example

<!-- reacd-live-preview -->

```tsx
--8<-- "examples/chat-shimmer.tsx"
```

## Properties

- `text`: required nonempty text.
- `active`: defaults true. False removes loading semantics and animation.

Motion uses named engine duration/iteration limits rather than arbitrary style props.
Reduced-motion preferences disable animation. Foreground text stays constant and does
not move, fade out or change layout. Only the decorative underline animates; foreground
colors are never interpolated, including with custom design templates. Active text is a
polite status; the decoration never marks that status busy or delays its announcement.

## Generative UI

Version `0.2` accepts literal `text`/`active` or explicit read references to declared
text/boolean keys. The component displays state without writing it. HTML, CSS, arbitrary
animation values and expression evaluation are not exposed to applications.
