---
template: preview.html
reacd_preview: ChatAttachment
reacd_preview_height: 560
---

# ChatAttachment

ChatAttachment displays host-owned file metadata with optional image preview, upload
status and removal. It does not upload files.

## Example

<!-- reacd-live-preview -->

```tsx
--8<-- "examples/chat-attachment.tsx"
```

## Properties

- `name`: required nonempty filename and image alternative text.
- `mediaType`: required MIME type, normalized to lowercase, such as `image/png`.
- `url`: optional HTTP(S) or root-relative image URL without credentials.
- `description`: optional supporting text; defaults to the media type.
- `status`: `idle` (default), `uploading` or `error`.
- `onRemove`: optional host callback; receives no DOM event.
- `disabled`: optional protection for the remove control.

Image failures preserve the filename and show the file fallback. The image stays within
its named size policy. Long metadata wraps. The remove control supports keyboard
activation; rejected host removal leaves the attachment visible. Uploading marks file
metadata and image previews busy while its progress announcement remains available.

Files remain plain metadata at this boundary. Browser File objects, object URLs, HTML,
CSS, styles and custom renderers are not part of the public API.

## Generative UI

Version `0.2` accepts the same literal metadata with `type: "ChatAttachment"`. Use
`removeAction: "removeReference"` instead of `onRemove`; the host must register the
action. File upload state remains owned by the application's isolated store.
