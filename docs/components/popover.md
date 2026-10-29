---
template: preview.html
reacd_preview: Popover
reacd_preview_height: 560
---

# Popover

Popover places interactive content next to a named trigger. Use it for short forms,
choices, and related actions. Use Tooltip for supplementary text and Modal for a task
that needs a larger dialog.

## Example

The catalog runs this compiled example with editable fields, nested layers, retained
content, a dialog parent, and logical appearance controls.

<!-- reacd-live-preview -->

```tsx
--8<-- "examples/popover.tsx"
```

## Properties

- `title`, `triggerLabel`: required nonempty labels for the dialog and its trigger.
- `open`, `onOpenChange`: required controlled boolean and typed change callback.
- `description`: optional supporting description.
- `children`, `footer`: optional safe reacd content and actions.
- `closeLabel`: explicit close action label, default `Close popover`.
- `placement`: `bottom` (default), `top`, `inline-start`, or `inline-end`.
- `align`: `center` (default), `start`, or `end`.
- `arrow`: false by default.
- `modal`: false by default; enables focus containment in click mode.
- `dismissible`: true by default. False blocks implicit dismissal.
- `retainContent`: false by default; true preserves mounted child state while closed.
- `disabled`: disables the trigger; trusted host state may still open the panel.
- `mode`: `click` (default) or `hover`.
- `openDelay`, `closeDelay`: `brief` (default) or `none` for hover interaction.

The brief hover delays are 300 ms to open and 150 ms to close. Applications choose named
behavior rather than raw timing, offsets, CSS, or vendor handles.

## Interaction and focus

Click, Enter, or Space opens the panel. Keyboard and mouse activation focus its first
control. Touch focuses the panel without automatically opening a virtual keyboard. Hover
mode adds delayed pointer entry and allows movement into the popup without stealing
keyboard focus. Hover previews remain non-modal even when `modal` is true.

Escape, outside press, and focus leaving a non-modal popup dismiss it when allowed. The
trigger and visible close action still close a non-dismissible panel. Nested Select
menus, hints, and popovers consume Escape before their containing panel or dialog.
Dismissal returns focus through the primitive's trigger handling.

## Layout and lifecycle

The engine can flip placement to avoid viewport collisions. Long content wraps and
scrolls within available bounds. Nested portals inherit the nearest active host and
template. Closing a retained ancestor hides and deactivates the popup while preserving
its controlled open value. Reopening restores the child layer without parent autofocus
overriding its focus. Theme changes preserve business values.

## Generative UI and server rendering

Version `0.2` requires `open: { state: "details.open", mode: "readWrite" }` referencing
a writable boolean definition. Body and footer nodes are recursively validated even
while closed. Unknown actions and incompatible bindings fail before rendering.

Server rendering preserves the trigger. Popups mount on the client with isolated
request/application state and stable hydration identities. The shadcn adapter follows
its Base UI Popover composition; application code receives no native styling escape.
