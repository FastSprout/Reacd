---
template: preview.html
reacd_preview: ChatPrompt
reacd_preview_height: 560
---

# ChatPrompt

ChatPrompt is a controlled multiline composer with safe attachment metadata and explicit
host capabilities. The host owns draft, transport and response state.

## Example

<!-- reacd-live-preview -->

```tsx
--8<-- "examples/chat-prompt.tsx"
```

## Properties

- `label`, `value`, `onValueChange(value)` and `onSubmit(value)` are required.
- `status`: `ready` (default), `submitted`, `streaming` or `error`.
- `description`, `placeholder`, `error`: optional plain text.
- `disabled`, `readOnly`: protect editing and all request capabilities.
- `submitOnEnter`: defaults true. Shift+Enter always inserts a newline. When false,
  Ctrl/Cmd+Enter sends. IME completion never sends.
- `onStop()`, `onRetry()`, `onClose()`: optional explicit host requests.
- `attachments`: bounded metadata with unique `id`, `name`, `mediaType`, optional safe
  `url`, `description`, `status` and `removable` flag. No File/SDK objects or uploads.
- `onRemoveAttachment(id)`: optional typed removal request.
- `footer`: safe reacd controls; defaults to ChatPromptSubmit.

Only ready composers with a nonblank draft or ready attachments can send. Uploading or
failed attachments block sending. No request clears the draft automatically. Missing
stop/retry capabilities remain visibly disabled. Public callbacks never receive DOM
events. Nested native forms are rejected with an actionable diagnostic; an actual portal
outside its enclosing form can host a separate prompt safely.

## Generative UI

The optional transport uses a declared text `value` reference with `read` or `readWrite`
access and a required registered `submitAction`. Status can be literal or a read-only
text reference restricted to valid statuses. Optional `stopAction`, `retryAction`,
`closeAction` and per-attachment `removeAction` keys identify host capabilities.
Read-mode drafts cannot edit, send or invoke request actions. Recursive footer actions
and bindings are validated before rendering; no string is executed as code.

Pending states mark the changing draft and attachment fields busy. Their progress status
and footer controls stay outside that busy content. Nested attachment progress remains
visible; independent footer statuses and portal controls keep their own semantics.
