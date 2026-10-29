---
template: preview.html
reacd_preview: Timeline
reacd_preview_height: 560
---

# Timeline

Timeline presents chronological events with visible progress labels. Keep it readonly or
connect event selection to host state.

## Example

<!-- reacd-live-preview -->

```tsx
--8<-- "examples/timeline.tsx"
```

## Properties

- `label`: required accessible list name.
- `items`: nonempty array of `{id, title, date?, description?, disabled?}`.
- `value`: optional current event id; defaults to the first event.
- `onValueChange`: optional callback receiving a requested event id.
- `orientation`: `vertical` (default) or wrapping `horizontal` tracks.
- `reverse`: reverse visual order without changing progress; defaults to false.
- `intent`: `primary` (default), `secondary` or `danger`.

Ids must be unique and value must name an event. Earlier events display `Completed`, the
current one displays `Current` and has `aria-current="step"`, and later ones display
`Upcoming`. Status never relies on color alone.

Providing a callback makes titles keyboard-operable buttons. A request does not change
progress until the host updates value. Disabled events cannot request selection.
Readonly titles add no tab stops. Full content wraps across templates and narrow
layouts; applications cannot pass native events, tags or styles.

## Generative UI

Version `0.2` supports an optional literal value for readonly progress or a text state
reference with `mode: "readWrite"` for interactive selection. The state value must
identify an existing event. Invalid initial values fail validation.
