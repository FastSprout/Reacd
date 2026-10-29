---
template: preview.html
reacd_preview: Carousel
reacd_preview_height: 560
---

# Carousel

Carousel presents controlled slides from validated component content. Inactive slides
remain mounted while hidden and inert, preserving application edits without exposing
inactive controls to keyboard or accessibility navigation.

<!-- reacd-live-preview -->

```tsx
--8<-- "examples/carousel.tsx"
```

Require label, items, value and onValueChange. Items are readonly
`{id, label, children}` objects with unique ids and validated reacd children. At most
twenty items are accepted. Value is a zero-based integer identifying an existing slide.
Empty items require value 0 and render empty text without navigation controls. One slide
also omits navigation.

Optional loop defaults false. Orientation defaults horizontal; vertical changes the
arrow-key axis. Disabled/readOnly prevent navigation transitions while leaving business
actions inside the active slide under their own host control. Callbacks request changes;
a host can reject a transition by preserving value.

Previous/Next and chooser controls use native buttons. Horizontal arrows follow App
direction; vertical arrows use Up/Down. Home/End jump to the first/last slide. These
keys apply when the carousel region itself is focused, preserving nested input caret
keys. External host changes repair focus from a newly inactive slide to the named region
without stealing focus already outside the old slide.

Optional state is ready(default), loading or error. Empty/loading/errorMessage customize
state text; onRetry and retryLabel provide a real host retry action. Controls wrap and
retain minimum touch targets. Slides use ordinary document flow without clipping or
animation, including for reduced-motion users.

Generative 0.2 binds value to number state with read/readWrite access and an item-count
constraint. Read access forces readonly navigation. Every item child tree is validated
and traversed for state/action references. Optional retryAction must be registered. Apps
and SSR requests remain isolated.

The trusted shadcn adapter implements a curated WAI carousel pattern. Autoplay, drag
gestures, arbitrary HTML/CSS and vendor render slots are outside this contract.
