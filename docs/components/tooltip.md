---
template: preview.html
reacd_preview: Tooltip
reacd_preview_height: 560
---

# Tooltip

Tooltip shows supplementary text when its child receives keyboard focus or mouse hover.
The underlying control keeps its action and accessible name. Keep essential information
in visible labels or descriptions; a tooltip is not a substitute for either.

## Example

The catalog runs this compiled example, including static/disabled anchors and a retained
dialog. Shortcut labels describe a hint; they do not register global keyboard actions.

<!-- reacd-live-preview -->

```tsx
--8<-- "examples/tooltip.tsx"
```

## Properties

- `text`: required nonempty supplementary text.
- `children`: required reacd anchor content; native elements and empty anchors fail.
- `placement`: `top` (default), `bottom`, `inline-start`, or `inline-end`.
- `delay`: `brief` (default, 600 ms on hover) or `none`. Keyboard focus opens directly.
- `arrow`: false by default; true shows an engine-positioned arrow.
- `shortcuts`: optional array of up to four nonempty labels, each at most 24 characters.
- `disabled`: disables the tooltip without disabling its child.
- `open` and `onOpenChange`: optional controlled pair. Omit `open` for automatic state;
  an optional `onOpenChange` can observe automatic changes.

## Interaction and accessibility

Hover or keyboard focus opens the hint. Escape dismisses it. Moving from the anchor onto
the popup keeps it available for reading; leaving both closes it. Child actions continue
to work, including touch activation. Touch users should never need to reveal a tooltip
to understand or activate a control.

An engine-owned group labels the supplementary text without replacing child names.
Enabled focusable descendants remain the tab stops. Static or disabled content gets a
focusable wrapper instead. Descendant content and disabled/tabindex changes update that
choice automatically; the wrapper does not become a nested button.

The popup wraps long text, limits its footprint to available viewport space, and can
scroll excess content. Placement may flip to avoid viewport collisions. Template values
reach the popup even when portaled. Inside a Modal, it uses the nearest dialog host.
Closing a retained ancestor deactivates its tooltip without remounting child state.
Reopening it preserves the child-only tab order.

## Generative UI and rendering

Version `0.2` supports the same literal hint properties and nested component nodes.
Optional `open` binds to writable boolean state; omitted `open` uses automatic transient
state. Read-only or incompatible bindings fail before rendering. Hint text/shortcut
labels are literal in this transport version.

Server rendering preserves the anchor and child identities. Popups mount on the client;
hydration does not move business state between application scopes. No raw CSS, offsets,
interactive popup content, arbitrary trigger attributes, or vendor handles are exposed.
The shadcn adapter follows its Base UI Tooltip composition.
