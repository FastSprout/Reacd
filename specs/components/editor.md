# Editor and EditorToolbar

Status: specified; document/selection foundation is implemented separately. Requirements
use the approved editor-proposal.md and editor-foundation.md. Existing CodeEditor is
unchanged. No Editor catalog entry is accepted by this specification alone.

EDITOR-001: Editor requires label and value:EditorDocument. Private-selection mode
requires onValueChange(document). Controlled-selection mode requires selection and
onEditChange({value, selection}) instead, forbidding onValueChange/onSelectionChange. A
controlled host stores one atomic readonly edit DTO in one Jotai atom; document and
selection can never be accepted independently. Optional description, placeholder,
readOnly, disabled, toolbar and safe auxiliary children are closed logical properties.
Selections use only the validated block-id/offset DTO. Native HTML, CSS, DOM refs, SDK
objects, arbitrary extension arrays and render callbacks are forbidden in all public
authoring APIs.

EDITOR-002: The adapter uses private TipTap React/core/pm/starter-kit 3.32.1. Bundled
features are configured to the closed document contract. Link is registered once;
autolinking, link-on-paste, automatic HTML interpretation and unsupported input rules
are disabled. Formatting keyboard commands remain available through the trusted SDK. The
adapter owns safe mention/emoji atom nodes and block identity attributes.

EDITOR-003: Conversion is explicit. Closed document nodes map to the private SDK schema
and back while preserving text, order, marks, links, stable ids, language and atom data.
SDK JSON remains unknown until bounded preflight, plain snapshotting and schema checks.
Unsupported or invalid SDK output cannot invoke host callbacks. Every structural node,
including containers/list items, is counted before SDK conversion or allocation. Inline
code excludes other marks and links, matching the trusted SDK's mark rules. The SDK may
merge adjacent equal-format text. Reverse projection splits merged text into bounded
Unicode scalar-safe chunks, preserving concatenated text and formatting. Budget
accounting includes every projected chunk before allocating DTO arrays.

EDITOR-004: Native new blocks receive deterministic ids from an editor-local ordered
allocator that avoids existing ids. No ambient time, randomness, global counter or
cross-store registry is used. Duplicate or malformed external ids are rejected rather
than silently rewritten. Copy/paste normalizes clipboard input to bounded plain text;
raw pasted HTML, styles/classes, scripts, images or arbitrary extensions are not used.

EDITOR-005: Controlled document and controlled selection remain authoritative. Accepted
host changes render through the same validation/conversion boundary. If the host rejects
an edit/command/selection request, the SDK view reconciles to the last controlled value.
Callbacks carry exactly one frozen validated domain DTO. Controlled edits without an
editable logical selection are rejected with a diagnostic and no callback. No state
callback fires during rendering, initialization, SSR hydration or a read-only
transition. Private SDK/history/selection metadata is never serialized as application
state.

EDITOR-006: EditorToolbar inherits a private logical command port from its nearest
Editor. Public items select only closed commands: bold, italic, strike, underline,
inline code, heading levels 1..3, paragraph, bullet/ordered list, quote, code block,
separator, safe link, remove link, undo and redo. A link item requires a validated href.
Each item may specify an accessible label and disabled intent. Duplicated commands are
invalid; an explicitly supplied item list must be nonempty. Named core policy owns the
default command set, labels, budgets and dimensions. Toolbar and menus never receive a
TipTap Editor instance.

EDITOR-007: Toolbar state reflects logical command availability and active formatting.
Keyboard navigation uses a labelled toolbar with visible focus and pressed states.
Commands restore editing focus intentionally. Orphan toolbars show actionable
diagnostics instead of dead controls. Disabled/read-only/hidden retained scopes cannot
mutate a document or claim unrelated keyboard shortcuts. Independent editors cannot
share ports.

EDITOR-008: A labelled static text projection is available during SSR and initial
hydration. The SDK initializes after hydration without document access on the server.
Stable ids/names and isolated host Jotai stores prevent request leakage. Empty documents
retain an editable paragraph; placeholder/loading/failure affordances remain accessible
and truthful. Theme templates own typography, borders, focus and spacing.

EDITOR-009: Optional generative transport uses the reviewed richDocument state kind.
Value bindings support read/readWrite. Read mode prevents edits and formatting actions.
Selection begins as private metadata in generative views; there is no selection state
kind. Recursive toolbar/auxiliary slots and all registered host intents are validated
before mounting. JSON is optional transport; primary examples use closed reacd TSX.

EDITOR-010: Tests precede implementation. Conversion acceptance covers every supported
node/mark/link, nested ordering, missing/duplicate ids, unsafe attributes, unknown SDK
data, text/atom selections, budgets and rejected edits. Runtime acceptance covers real
typing, multiline/IME, safe paste, toolbar shortcuts/pressed states, link safety,
undo/redo, scope isolation, controlled selection, host rejection, disabled/read-only,
SSR/hydration and generative read/write projections. Browser checks cover both themes,
narrow/RTL/200%, selection/focus and no text escape. Require per-file 100% all four
coverage metrics, strict TS7, typed lint, source policy and runnable public examples.
