---
template: preview.html
reacd_preview: Card
reacd_preview_height: 560
---

# Card

Card groups validated component content on a template-defined surface.

<!-- reacd-live-preview -->

```tsx
--8<-- "examples/card.tsx"
```

Use children for body content. Optional header and footer accept the same closed reacd
component vocabulary. Optional spacing is small, medium or large; medium is the default.
Optional label supplies a named region; an unnamed Card remains a structural container.

Empty header/footer slots create no wrappers. The adapter owns padding, borders,
corners, shadows and layout. Slot content wraps and follows normal document flow.
Interactive content retains its own keyboard and accessibility behavior.

Generative 0.2 uses children plus optional header/footer node arrays. Validation and
rendering traverse every slot, including nested state and action references. Native
HTML, arbitrary render functions, CSS and styling props are rejected in every slot.
