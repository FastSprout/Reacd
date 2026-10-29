---
template: preview.html
reacd_preview: ChatPalette
reacd_preview_height: 560
---

# ChatPalette

ChatPalette composes a scrollable conversation and a reachable prompt slot. It uses the
existing Modal component when a dialog is needed.

## Example

<!-- reacd-live-preview -->

```tsx
--8<-- "examples/chat-palette.tsx"
```

## Properties

- `label`: required accessible conversation region name.
- `children`: safe reacd conversation content.
- `prompt`: optional safe reacd composer slot.

The adapter owns bounded layout and theme styling. Conversation state belongs to the
host's isolated Jotai store. ChatMessages and ChatPrompt own their loading/error/empty
states. ChatPalette has no independent focus trap or dismiss listener. Its conversation
area reserves a viewport-capped extent before the first message, so new transcript
content does not displace the focused composer. Content and prompt stay in separate
normal-flow tracks rather than overlapping.

The optional transport accepts recursive `children` and `prompt` node arrays. Actions
and state bindings in both slots are validated before controls render.
