---
template: preview.html
reacd_preview: ChatMessage
reacd_preview_height: 560
---

# ChatMessage

ChatMessage presents one identified message, author, role, literal text, attachments and
explicit host actions. The message's identity survives streaming replacements.

## Example

<!-- reacd-live-preview -->

```tsx
--8<-- "examples/chat-message.tsx"
```

## Properties

- `id`: required logical message key.
- `author`: required explicit author label and accessible article name.
- `role`: `user`, `assistant`, `system` or `tool`.
- `content`: required plain text, including an empty pending response.
- `attachments`: optional readonly file metadata array, at most ten entries.
- `actions`: optional readonly `{id, label, onPress, disabled?}` array, at most eight.
- `status`: `ready` (default), `streaming` or `error`.
- `error`: optional failure description replacing the default error message.

Message actions have unique identifiers and keyboard controls. Message data remains
host-owned. Streaming marks changing message text busy while its progress announcement
stays outside that content; failure retains partial text. Content is escaped, preserves
newlines and wraps long unbroken text. HTML, Markdown parsing, SDK objects, arbitrary
slots and physical positioning props are outside this API.

## Generative UI

Version `0.2` uses literal message data with `type: "ChatMessage"`. Each action uses
`{id, label, action, disabled?}` with a registered host action key in place of a
function. No provider API or network request is implied.
