# Chat composer components

Status: specified; implementation follows the accepted feedback batch. Scope:
ChatPrompt, ChatPromptSubmit and ChatPalette.

CHAT-COMPOSER-001: ChatPrompt is a labelled controlled multiline composer. Required
value, onValueChange and onSubmit(value) use bounded plain text, never DOM events.
Status is ready/submitted/streaming/error, default ready. Optional placeholder,
description, disabled, readOnly and submitOnEnter are closed logical props. Named core
policy owns draft limits, rows and all dimensions. The host owns draft/network state;
submission never clears text, fabricates a response or executes model output. Pending
states mark the closed draft/attachment fields busy, with the polite pending status and
safe footer controls outside that busy subtree. Visible nested attachment progress is
ordinary text while this outer pending announcement is active. Independent footer or
portal statuses retain their own semantics; no scope may globally mute them.

CHAT-COMPOSER-002: Default Enter requests submission; Shift+Enter preserves a newline.
With submitOnEnter=false, plain Enter inserts a newline and Ctrl/Cmd+Enter requests
submission. IME composition and its completion Enter must never submit. Empty or
whitespace-only drafts cannot send unless host attachment metadata is present. Only
ready composers may send. Disabled/read-only composers cannot send. Error state offers
explicit retry; the host returns status to ready before new sends. The same send gate
applies to keyboard, button and native form submission. A rejected host callback
preserves the draft and status. Duplicate native submission is prevented.

CHAT-COMPOSER-003: ChatPromptSubmit is a separate status-aware component. It inherits
the nearest ChatPrompt scope without duplicating callbacks or status. In standalone
usage it requires an explicit action for an enabled control. Ready submits;
submitted/streaming requests optional onStop; error requests optional onRetry. Missing
stop/retry capabilities render an honestly labelled disabled control. Prop conflicts
with an enclosing prompt cannot override its send gate. All buttons have textual, stable
accessible names. No state transition fires from rendering or a status change.

CHAT-COMPOSER-004: ChatPrompt accepts only safe reacd controls in an optional footer.
Its default footer supplies ChatPromptSubmit. Renderer context carries only logical
status/capabilities/actions and remains scoped per prompt. It contains no global
conversation store. Separate prompts, stores and SSR requests remain isolated.

CHAT-COMPOSER-005: Host-owned attachments are bounded metadata DTOs with unique ids.
They compose ChatAttachment with an optional typed remove-id callback. An attachment may
set removable=false to omit its remove control. File objects, object URLs, upload
services, drag/drop parsing and SDK parts are outside this boundary; FileUpload may
provide metadata through host state. File-only submission is explicit.
Disabled/read-only composers cannot remove attachments or modify the draft. Uploading or
failed attachment metadata blocks submission until the host resolves or removes those
attachments. Read-only composers also disable stop/retry capabilities.

CHAT-COMPOSER-006: ChatPalette is a closed layout wrapper with an accessible label, safe
conversation children and optional safe prompt slot. It keeps content scrollable and
prompt controls reachable with named layout policy. It composes with public Modal
instead of duplicating modal/focus logic or modifying A-owned overlay components.
Empty/loading/error states remain owned by its ChatMessages/ChatPrompt children.

CHAT-COMPOSER-007: Optional onClose claims Escape only while the prompt is active;
without it, Escape remains available to an enclosing Modal. Hidden retained overlays
must not claim Escape or submit. Existing escape/portal scope infrastructure owns the
layer boundary. Any requested renderer-level Form scope guard must be coordinated before
implementation: never create nested native forms inside Form or ChatPrompt.

CHAT-COMPOSER-010: TrustedFormBoundary guards native forms using a boolean semantic
scope and actual committed DOM ancestry. Outside a semantic form it renders normally.
Inside one, it initially renders an actionable Issues view within a stable private
wrapper. A stable callback ref checks closest native form ancestry. Only a wrapper
outside a real form, such as a portal host, may subsequently render its native form. It
never commits a nested form, preserves SSR/hydration shape and introduces no business
props or application DOM access. FormSurface and ChatPrompt compose this same boundary;
no A-owned Modal changes are required. Acceptance covers direct nesting, outside
portals, forms nested inside portals, replay and hydration diagnostics. Native Prompt
submission stops React portal bubbling so an outside portal form cannot invoke a
semantically enclosing Form's submission callback.

CHAT-COMPOSER-008: Generative transport uses declared text value references with
read/readWrite access. Read mode prevents editing/new sends. Explicit registered
submit/stop/retry/close keys provide host intents; no expressions or event code are
evaluated. Per-attachment remove keys identify the host intent without arbitrary
arguments. Palette/footer slots use recursive safe generative nodes. Binding/action
validation traverses every slot before rendering controls.

CHAT-COMPOSER-009: Acceptance covers exact schemas/types, all request statuses,
keyboard/newline/IME/whitespace/file-only gates, protected and rejected transitions,
independent contexts, callback registration, shared-state readers/writers, nested-form
prevention, native form behavior and SSR/hydration. Real browsers verify both themes,
narrow/200%/RTL layout, prompt visibility in Modal, focus restoration and scoped Escape.
Require 100% in all four runtime coverage metrics and runnable public TSX examples.
After transcript growth, the focused composer remains visible within its surrounding
scroll viewport at 200% text size; transcript content must not displace it off-screen.
Palette reserves its named conversation extent from initial mount, capped by viewport
height. Transcript and prompt occupy separate normal-flow tracks; the prompt must not
cover transcript content with a sticky overlay.

References: cached Nuxt UI ChatPrompt, ChatPromptSubmit and ChatPalette primary
documents, retrieved 2026-10-29. Adaptation replaces arbitrary Vue slots/HTML/SDK/File
objects with closed reacd slots, metadata and explicit controlled host capabilities.
