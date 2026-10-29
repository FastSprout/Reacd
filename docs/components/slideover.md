---
template: preview.html
reacd_preview: Slideover
reacd_preview_height: 560
---

# Slideover

Slideover opens a controlled sheet from a logical viewport edge. It uses private Base UI
Dialog behavior with engine-owned edge placement and focus management.

## Example

<!-- reacd-live-preview -->

```tsx
--8<-- "examples/slideover.tsx"
```

## Properties

- `title` and `description`: required accessible dialog text.
- `open` and `onOpenChange`: controlled state and requested boolean changes.
- `triggerLabel` and `closeLabel`: optional built-in trigger and close text.
- `disabled`: blocks the built-in trigger from opening the sheet.
- `children` and `footer`: optional safe reacd content.
- `placement`: `end` by default, or `top`, `bottom`, `start`. Inline edges follow the
  nearest application direction scope, including portal content.
- `dismissible`: true by default. False refuses Escape and outside dismissal while
  preserving the explicit close button.
- `modal` and `overlay`: true by default. A nonmodal sheet permits background actions.
- `fullscreen`: false by default; dimensions remain engine-owned.
- `retainContent`: keeps descendants mounted while closed, with nested layers inactive.

The host may refuse a change by retaining `open`. The adapter names the dialog, manages
focus return and preserves nested Escape ordering. Bounded panels scroll with long
content and large text. This sheet contract has no swipe or snap-point API; use Drawer
when swipe dismissal is required.

## Generative transport

Version `0.2` binds open to writable boolean state. Children are a required node array;
footer is optional. Every descendant action is validated before rendering. Failed state
writes retain the current open state and show a diagnostic.
