---
template: preview.html
reacd_preview: ChatTool
reacd_preview_height: 560
---

# ChatTool

ChatTool displays tool status and plain text details with explicit host decisions. It
never executes a command, model output, URL or tool itself.

## Example

<!-- reacd-live-preview -->

```tsx
--8<-- "examples/chat-tool.tsx"
```

## Properties

- `label`: required tool name and disclosure label.
- `status`: `pending`, `running`, `approval`, `success` or `error`.
- `open`, `onOpenChange`: required controlled disclosure state and callback.
- `input`, `output`, `error`: optional bounded plain text details.
- `onApprove`, `onReject`: an optional pair, permitted only in approval status.
- `onRetry`: optional callback, permitted only in error status.
- `disabled`: protects disclosure and all action controls.

Approval without callbacks remains a read-only status display. A single approval
callback is invalid. Rejected host callbacks leave status and details unchanged.
Keyboard controls expose named decisions without forwarding DOM events. Output wraps
inside a bounded scroll region; strings are never interpreted as HTML or code.

## Generative UI

Version `0.2` uses a declared boolean `open` reference with read/readWrite access.
`approveAction`/`rejectAction` replace the callback pair and `retryAction` replaces
retry. Every supplied key must be registered before rendering. Read-mode disclosure is
protected. Input/output/error are literal data updated through a validated document
replacement, with host application state kept in its isolated Jotai store.
