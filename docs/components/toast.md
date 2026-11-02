---
reacd_preview: Toast
---

# Toast

## Adapter availability

The bundled shadcn/ui adapter maps `Toast` to the official shadcn Radix Toast
recipe and Radix Toast 1.3.1. Its native SDK owns announcements, duration, focus
navigation and gestures. Material UI has no native mapping and reports
`UnsupportedAdapterComponentError`.

Toast presents transient feedback using controlled application state. Each application
Surface owns one private notification viewport, with up to three visible messages and 32
registered messages. Additional declarations report the queue limit and wait for a slot
instead of overlapping the existing stack.

## Example

Save project settings, dismiss the confirmation, or undo the change from the
notification. An actionable notification is persistent by default.

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
When a dismissal request leaves `open=true`, the notification becomes persistent
until the host closes it.

## Interaction

Use F6 to focus the notification viewport, Tab to enter a notification and its controls,
and Escape to dismiss the focused notification. Urgent messages announce without
taking keyboard focus. Native Close/Escape can focus the notification viewport;
Tab then enters its remaining cards. Closing the final notification removes the
empty viewport. There is no promise to focus another card or restore its opener.
Host-driven closing does not invent a focus target.

Timers pause during pointer hover, focus and window blur, and resume through
native pointer/focus events. There is no separate visibility-change scheduler.
Actionable notifications remain available without a time limit by default.

Messages use a native scroll region with scoped template and text direction.
The grip uses the SDK's rightward swipe direction, including for RTL content;
the message area is excluded from swipe handling. Controlled host state still
decides whether a dismissal is accepted. Reduced motion suppresses animation.

The shadcn integration uses an isolated Radix provider per Surface rather than a
module-global notification manager. Applications declare logical props and state.
The contract requires registration after hydration, so server markup does not announce
transient messages before a client is attached.

## Generative state

Version `0.2` binds open to writable boolean state. An optional action references a
registered handler. Rejected writes retain the notification; action handlers are checked
as own callable properties at activation, including after host-side table mutations.
