---
template: preview.html
reacd_preview: ChatMessages
reacd_preview_height: 560
---

# ChatMessages

ChatMessages displays a labelled transcript with reader-aware following, explicit
request status and host-controlled recovery.

## Example

<!-- reacd-live-preview -->

```tsx
--8<-- "examples/chat-messages.tsx"
```

## Properties

- `label`: required accessible log and region name.
- `messages`: required readonly array of ChatMessage DTOs with unique ids, at most 200.
- `status`: `ready` (default), `submitted`, `streaming` or `error`.
- `error`: optional error description; partial messages stay visible.
- `onRetry`: optional callback displayed only in the error state.
- `emptyLabel`: optional replacement for `No messages yet.`.
- `followLatest`: defaults true; false disables automatic scrolling and its control.

The focusable log announces changes politely and is busy during submission/streaming.
Following initially reaches the end, then stops when the reader scrolls upward.
`Jump to latest message` resumes following without moving keyboard focus or the page.
Scrolling stays within the transcript. Narrow screens and RTL use the same data.

This component accepts literal data and typed callbacks rather than SDK instances, HTML
or custom render functions. The host owns network requests and Jotai state.

## Generative UI

Version `0.2` uses `type: "ChatMessages"`, literal messages and optional `retryAction`.
Nested message actions use registered keys as described by ChatMessage. Replacing a
validated document updates the transcript; the view does not create shared mutable
conversation state or infer actions from untrusted message content.

While the transcript log is busy, its external status announces progress. Nested message
and attachment progress remains visible without competing live announcements. When the
log becomes ready, independent nested statuses regain their live semantics.
