---
template: preview.html
reacd_preview: Modal
reacd_preview_height: 560
---

# Modal

Modal opens a controlled dialog using the active theme and Jotai state. It owns focus
management, keyboard dismissal, background interaction, and portal layout. Application
code supplies reacd content and logical values.

## Example

This is the same source compiled and run under Actions and feedback in the local
catalog. Wrap it in `ReacdProvider` when placing it in another application.

<!-- reacd-live-preview -->

```tsx
--8<-- "examples/modal.tsx"
```

## Properties

- `title`, `description`: required accessible text identifying the dialog.
- `open`, `onOpenChange`: controlled boolean and typed change callback.
- `triggerLabel`: optional built-in trigger; omit for programmatic opening.
- `closeLabel`: visible close action text; defaults to `Close`.
- `children`, `footer`: content composed from reacd components.
- `dismissible`: true by default; false blocks Escape and outside dismissal.
- `modal`: true by default; false permits background interaction.
- `overlay`: true by default; disabled automatically in non-modal mode.
- `fullscreen`: false by default; uses available viewport space when enabled.
- `retainContent`: false by default; true preserves mounted child state when closed.
- `disabled`: disables the built-in trigger, while preserving the close action.

Host logic can reject an open/close request by keeping `open` unchanged. A visible close
action remains available even when outside dismissal is disabled. Required labels,
callbacks, booleans, content, and unknown properties are validated before rendering.
Styling props, native elements, refs, and browser events are not public.

## Focus and layout

Modal mode traps focus within the active dialog, blocks background interactions, and
restores the trigger or previous focus on close. Nested dialogs close in stack order.
Escape dismisses the active dialog when allowed. Tab and Shift+Tab stay within modal
content. Non-modal mode releases the trap and background lock.

Long content scrolls within the dialog. Text wraps inside its container, including
enlarged text and long identifiers. Portals inherit the active theme and state
providers. Closed retained content is hidden and stops trapping focus or locking the
page. Portals mount on the client; server rendering does not emit popup content.

Child menus mount inside their nearest dialog. Closing a retained dialog closes these
transient menus while preserving controlled field values. Nested dialogs follow their
ancestor's visibility; reopening the ancestor applies the child's controlled open state.

## Generative UI

A version `0.2` Modal binds `open` to a writable boolean state reference. Its `children`
and optional `footer` are arrays of generative declarations. References and action names
in those arrays are validated even when the dialog is closed. The same component and
adapter render TSX and generative declarations.

Ordinary close restores focus to its active trigger. When an ancestor becomes
inactive, closing the retained modal does not restore focus into that stale scope
or reactivate an automatic tab. Host-controlled open intent stays intact.
