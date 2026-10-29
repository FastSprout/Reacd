# FileUpload

Status: implemented with scoped unit, SSR and production browser verification. Agent A
owns final root integration acceptance.

UPLOAD-001: Provide a closed TSX FileUpload with label, controlled readonly value and
onValueChange. Files are immutable DTOs containing unique id, name, mediaType,
lastModified, exact byte size and content: { encoding: base64, data: string }. Payloads
contain actual readable bytes, not a metadata-only upload facade. Native
File/Blob/FileReader objects and executable readers never cross the public boundary.

UPLOAD-002: Named policy limits are ten files, eight MiB per file and sixteen MiB total.
Validate array count, declared sizes, encoded lengths and total before copies, byte
allocation or native reads. Canonical base64 validation checks alphabet, length, padding
and unused trailing bits before decode. Verify actual read byte length and decoded size.
Never use unbounded argument spread with String.fromCharCode.

UPLOAD-003: Host file IDs are stable and unique. The trusted client adapter generates
new collision-checked IDs only during intake; SSR markup uses no ambient randomness.
Names and media types are bounded data. Identifiers, filenames and MIME types reject
every line terminator, including Unicode line and paragraph separators. Closed accept
groups all/images/pdf/text are client filters, without security content sniffing claims.
Reject invalid batches explicitly, without silently truncating or dropping individual
files.

UPLOAD-004: Support genuine native chooser, drag/drop, removal and cancellation.
Keyboard users can activate the labelled chooser and remove individual files. Reader
resources clean up on unmount, host value changes, disabled and readOnly transitions.
Explicit cancellation returns focus to the visible chooser. Stale asynchronous results
cannot propose writes. Host rejection preserves controlled files. Reading status
describes real intake; no network upload or progress is invented. Host payload/settings
changes and protection clear obsolete intake feedback. At narrow or zoomed widths,
removal actions yield a separate row rather than forcing filenames into a narrow letter
column. Use the existing readable stack-track policy.

UPLOAD-005: Optional multiple mode and bounded maxFiles express logical cardinality.
Single mode permits at most one file. Disabled/readOnly prevent chooser/drop/removal
mutations. Required validation follows the controlled payload, including valid initial
files. A named native bridge serializes the closed DTO list as JSON: readOnly is
retained and disabled is omitted. The chooser has no competing form name. Do not pretend
that controlled payloads reconstruct native input.files. Invalid focus returns to a
visible control and integrates with the existing form/field engine.

UPLOAD-006: Optional generative UI binds the approved fileList state kind with
read/readWrite permissions. Only validated DTO data and registered state references are
accepted. The global initial document budget remains one million characters; large
payloads are runtime-only. Do not raise global budgets to embed large initial files.
Apps, shared bindings and SSR requests retain isolated stores and constraints.

UPLOAD-007: Acceptance starts with strict unknown-data and budget tests before the state
kind is registered. Cover canonical/noncanonical base64, no allocation/read before
rejection, real text/binary/empty content, count/per-file/total limits, duplicate IDs,
native/drop/keyboard/removal, controlled rejection, cancellation, stale reads, reader
failure, native FormData/required/protection, generative permissions and SSR. Verify
both templates, actual RTL, long names, 200% text and narrow browser geometry. Every
owned executable file requires 100% in all four coverage metrics.

Primary references: official Nuxt FileUpload source, native file reading APIs and
[RFC 4648 canonical encoding](https://www.rfc-editor.org/rfc/rfc4648#section-3.5).
