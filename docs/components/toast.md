---
template: preview.html
reacd_preview: Toast
reacd_preview_height: 560
---

# Toast

Toast presents transient feedback using controlled application state. Each application
Surface owns one private notification viewport, with up to three visible messages and 32
registered messages. Additional declarations report the queue limit and wait for a slot
instead of overlapping the existing stack.

## Example

<!-- reacd-live-preview -->

```tsx
--8<-- "examples/toast.tsx"
```

## Properties

- `title`: required notification title. `description` adds supporting plain text.
- `open` and `onOpenChange(false)`: controlled visibility. The synchronous callback may
  return false to veto dismissal; keeping open true retains the message.
- `intent`: `neutral`, `success` or `danger`, mapped through the active template.
- `priority`: `normal` announces politely; `urgent` uses the native urgent live region.
- `duration`: `normal` (five seconds), `long` (ten seconds), or `persistent`. Ordinary
  messages default to normal; actionable messages default to persistent.
- `action`: a named label and synchronous zero-argument `onPress` callback.
- `closeOnAction`: accepted actions close by default; false leaves the message open.
- `closeLabel`: overrides the named dismissal button.

Callbacks accept boolean or no return value. A false action result keeps the
notification open. Invalid results or thrown callbacks show feedback without dismissing.
After a native dismissal is rejected, the message stays persistent until the host closes
it.

## Interaction

Use F6 to focus the notification viewport, Tab to enter a notification and its controls,
and Escape to dismiss the focused notification. Urgent messages announce without taking
keyboard focus. Closing restores focus through the native primitive. Timers pause during
hover, focus and loss of window visibility. Actionable notifications remain available
without a time limit by default.

Messages wrap inside a viewport-bounded scroll region. Scoped templates and direction
are captured at the declaration; RTL cards align to their logical end. There is no
required motion, so reduced-motion users receive the same behavior. Native pointer/touch
swipes start from the visible grip, use the card's logical direction, and obey
controlled host state. The message area scrolls independently.

The shadcn adapter uses Base UI's private provider and announcement primitives with
shadcn controls. Applications use logical props and controlled state. Notifications are
registered after client hydration; server markup does not announce transient messages
before a client is attached.

## Generative state

Version `0.2` binds open to writable boolean state. An optional action references a
registered handler. Rejected writes retain the notification; action handlers are checked
as own callable properties at activation, including after host-side table mutations.
