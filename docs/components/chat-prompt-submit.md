---
template: preview.html
reacd_preview: ChatPromptSubmit
reacd_preview_height: 560
---

# ChatPromptSubmit

ChatPromptSubmit renders a named send, stop or retry control. Inside ChatPrompt it
inherits that composer's capabilities and send gate.

## Example

<!-- reacd-live-preview -->

```tsx
--8<-- "examples/chat-prompt-submit.tsx"
```

## Properties

- `status`: optional ready/submitted/streaming/error status for standalone usage.
- `onSubmit()`, `onStop()`, `onRetry()`: explicit standalone host capabilities.
- `label`, `disabled`: optional accessible label and protection.

A standalone ready control requires `onSubmit`. Missing stop/retry callbacks produce
disabled controls labelled "Response in progress" or "Retry unavailable". Inside a
prompt, status/action overrides produce a diagnostic instead of bypassing its send gate.
Callback requests have zero arguments; no state change occurs during rendering.

The optional transport replaces callbacks with registered `submitAction`, `stopAction`
and `retryAction` keys. A prompt footer normally omits these keys to inherit its scope.
