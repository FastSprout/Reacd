# Chat transcript components

Status: specified; implementation and integrated acceptance remain separate.

CHAT-001: ChatAttachment represents one host-owned file DTO with required name and
mediaType, optional safe HTTP(S)/root-relative url, description and upload status
idle/uploading/error. Data URLs, credentials, scripts, File instances and style/HTML
escape hatches are rejected. Media types normalize to lowercase. Only image media types
show bounded previews. Failed images retain their filename and file fallback. An
optional onRemove callback requests host removal; disabled removal remains visible and
cannot fire. Uploading marks changing file metadata busy; its visible progress status
stays outside that busy content. No upload or fetch business service is implied.

CHAT-002: ChatMessage has required unique logical id, explicit author, closed role
user/assistant/system/tool and plain text content. Optional attachment DTOs and uniquely
identified labelled actions are bounded by named policies. Action callbacks receive no
DOM event. Status ready/streaming/error controls accessible busy/error feedback, not
content ownership. Streaming replacements preserve message identity. Text is escaped and
preserves whitespace while wrapping unbroken content. Empty text is valid for pending or
attachment-only messages. Streaming marks message text busy while its live status stays
outside that content; the named article retains its identity. Actions are explicit host
intents.

CHAT-003: ChatMessages requires a label and bounded readonly message DTO array with
unique ids. It provides a labelled focusable log, ordered messages, empty/loading/error
feedback and optional host retry callback. Ready/submitted/streaming/error statuses are
explicit. The log is polite and atomic=false; streaming marks busy until ready. Failures
retain existing messages. While the log is busy, nested message/file loading copy stays
visible as ordinary text and the single external transcript status announces progress.
When the log is ready, independent nested statuses regain their live semantics. This
private scope does not silence sibling widgets or prompt footer/portal controls.
Changing a status or template never mutates data.

CHAT-004: Follow-latest presentation is enabled by default. Initial mount scrolls to the
end. Subsequent transcript updates follow only while the reader is within the named
bottom distance. Scrolling upward suspends following and reveals a keyboard button to
reach the latest message. Activating it resumes following. A false followLatest prop
disables automatic scroll and the return button. Scroll effects stay in the trusted
adapter. Passive following cannot move document focus or scroll the page. Explicit jump
activation focuses the transcript log without scrolling the document, so removing the
jump button does not discard keyboard position. Readonly messages are never mutated;
submitted/streaming busy feedback does not block this explicit navigation action.

CHAT-005: The shadcn adapter composes existing Card/Button recipes with validated
tokens, logical alignment and bounded image/scroll dimensions from core policy. Both
templates, actual scoped RTL, narrow widths and 200% text retain all controls and
content. App-level state uses isolated Jotai stores; no global conversation store or SDK
runtime is introduced. Local viewport/failure bookkeeping is presentation state.

CHAT-006: Public authoring uses separate modules and named Props for all three TSX
components. Optional generative transport uses literal DTOs. Attachment removal, message
actions and retry replace functions with explicit registered action keys. Host changes
may replace a validated document; these readonly transcript views do not invent a new
mutable generative state kind.

CHAT-007: Acceptance covers strict schemas, identities, caps, closed consumer types,
escaped markup, every upload/message/list status, image failure, keyboard removal,
actions/retry protection, controlled host updates and rejection, isolated stores,
SSR/hydration and follow/suspend/resume behavior. Each owned runtime file must reach
100% statements/branches/functions/lines. Browser geometry, scroll and RTL evidence are
separate from schema and jsdom checks.

CHAT-008: Attachment metadata retains a named minimum readable inline track when space
permits. When the track cannot fit, metadata reflows onto its own row rather than
competing with removal controls. The remove button occupies its own full row. Browser
acceptance measures the metadata's readable width, in addition to checking overflow. A
layout without overflow may still be unusable if text becomes too narrow.

Upstream references are cached in .cache/references/chat-*-nuxt.md, retrieved
2026-10-29. They describe Nuxt UI 4's ChatAttachment, ChatMessage and ChatMessages.

React adaptation: callbacks and literal file metadata replace Vue events/File/SDK
objects. Plain text and structured attachment data replace arbitrary Markdown/HTML
slots. Semantic roles replace physical left/right alignment. Follow-latest preserves
reader position instead of forcing submitted messages to the viewport top. No
virtualization, Markdown parser, network upload, provider API or SDK-specific parts are
claimed by this contract.
