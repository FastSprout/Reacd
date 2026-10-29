---
template: preview.html
reacd_preview: ChatReasoning
reacd_preview_height: 560
---

# ChatReasoning

ChatReasoning presents a host-provided summary in a controlled disclosure. It does not
request or reveal private model reasoning.

## Example

<!-- reacd-live-preview -->

```tsx
--8<-- "examples/chat-reasoning.tsx"
```

## Properties

- `text`: required bounded plain text. Empty text shows the empty summary message.
- `open`, `onOpenChange`: required controlled disclosure state and callback.
- `label`: defaults to `Reasoning summary`.
- `streaming`: defaults false; marks changing summary details busy and activates its
  label pulse.
- `autoOpen`, `autoClose`: default false; opt into stream-edge state requests.
- `disabled`: optional protection for disclosure and automatic requests.

Automatic requests fire once per stream edge and respect host rejection. A manual toggle
during a stream suppresses automatic closing for that stream cycle. No timer or hidden
application state changes the disclosure. Text is escaped and wraps inside bounded
scrollable details. Reduced motion disables the label animation.

## Generative UI

Version `0.2` requires `open: {state: "summaryOpen", mode: "readWrite"}` or an explicit
read binding. Read mode disables disclosure transitions. `text` accepts a literal or
`{state: "summary", mode: "read"}`. The keys must match declared boolean and text state.
Styling, native events, Markdown/HTML and arbitrary slots are rejected.
