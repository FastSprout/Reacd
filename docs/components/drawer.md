---
template: preview.html
reacd_preview: Drawer
reacd_preview_height: 560
---

# Drawer

Drawer opens a controlled panel from a logical viewport edge. It supports ordinary close
controls and swipe dismissal through the private Base UI Drawer primitive.

## Example

<!-- reacd-live-preview -->

```tsx
--8<-- "examples/drawer.tsx"
```

## Properties

- `title` and `description`: required accessible dialog text.
- `open` and `onOpenChange`: controlled state and requested boolean changes.
- `triggerLabel`: optional built-in button; `disabled` disables this trigger.
- `closeLabel`: accessible close button text, `Close` by default.
- `children` and `footer`: optional safe reacd content.
- `placement`: `bottom` by default, or `top`, `start`, `end`. Inline edges resolve from
  scoped writing direction rather than document language.
- `handle`: shows the decorative swipe affordance by default.
- `dismissible`: true by default. False refuses Escape, outside and swipe dismissal
  while retaining the explicit close control.
- `modal` and `overlay`: true by default. Nonmodal panels permit background interaction.
- `fullscreen`: false by default; dimensions remain engine-owned.
- `retainContent`: preserves mounted descendants while closed, without leaving nested
  overlays active. Keep persistent business values in application state.

The host may refuse any change by retaining `open`. Focus returns to the trigger on
close. Nested popovers dismiss before their containing panel. Long content scrolls
within bounded viewport space; text is wrapped rather than hidden to force a fit.

The shadcn theme adapter uses the installed Base UI Drawer instead of adding Vaul. Raw
snap points, pointer callbacks, CSS overrides and custom popup elements are outside this
closed contract. Swipe behavior complements keyboard controls.

## Generative transport

Version `0.2` binds open to writable boolean state. Children are a required node array;
footer is optional. Descendant actions are validated before rendering. Rejected open or
close writes show a diagnostic and retain the current state.
