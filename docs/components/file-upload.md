---
template: preview.html
reacd_preview: FileUpload
reacd_preview_height: 560
---

# FileUpload

FileUpload reads actual local file contents into a host-controlled, immutable list. The
host owns persistence and network operations. The component performs no upload.

<!-- reacd-live-preview -->

```tsx
--8<-- "examples/file-upload.tsx"
```

```tsx
<FileUpload
  label="Attachments"
  value={files}
  onValueChange={setFiles}
  name="attachments"
  required
/>
```

Each UploadFile contains id, name, mediaType, lastModified, size, and content: {
encoding: 'base64', data: string }. Use readUploadBytes(file) to obtain validated
Uint8Array bytes. No native File, Blob or reader crosses the public API.

Multiple mode appends one complete accepted batch; multiple={false} replaces the single
file. maxFiles can lower the default ten-file limit. Per-file and total budgets are
eight and sixteen MiB. Entire invalid batches are rejected before reading. Canonical
base64 verifies exact lengths, padding and unused bits before decoding.

accept is all, images, pdf or text. These are local chooser and MIME filters; they do
not authenticate file content or replace server validation. Empty native MIME types
become application/octet-stream. Names, IDs and MIME metadata reject line terminators.

The labelled chooser and drag/drop share the same intake. Reading can be canceled.
Unmounting, host payload/settings changes and protection cancel pending readers. Stale
results cannot overwrite newer host values. A rejected callback leaves selected files
unchanged. Read-only displays contents without mutation controls. Disabled omits the
named form value. Read-only retains it.

The named native form value is JSON for the complete DTO list. It does not reconstruct
input.files. Required validation follows the controlled list and focuses a visible
control when invalid. Optional generative UI uses fileList state references with
reader/writer permissions and the same cardinality/type constraints. The initial JSON
document budget remains one million characters; larger payloads belong in runtime state
updates.

The compiled live example uses Jotai, native form validation, real byte decoding,
protection, host rejection and App direction. Image previews, folders, arbitrary accept
expressions and network progress are outside this curated component.
