# Native Editor controlled session

EDITOR-NATIVE-001: A private TipTap session starts only after hydration. Its initial
static projection escapes text and preserves block order. The real textbox has a visible
label, multiline semantics and explicit read-only/disabled state. Initialization and
host reconciliation never invoke application callbacks.

EDITOR-NATIVE-002: Native document transactions project through the bounded codec, then
publish one frozen logical document. Controlled-selection mode publishes one atomic
{value, selection} edit DTO for each document or selection request. It never publishes
partial updates. Host-controlled props remain authoritative; rejected document/selection
requests are restored without a second business callback. Identity repair is metadata
and never creates a second application update. Controlled hosts accept or reject the
whole edit DTO. A selection-only native transaction publishes only when its native
document matches the authoritative value, preventing stale metadata transactions from
reverting a pending document request. Edits without an editable logical point are
rejected explicitly. Declaration-time selection/value cross-validation remains strict.

EDITOR-NATIVE-003: Disabled, read-only and hidden retained editor scopes cannot edit,
paste, format, move or begin drag sessions. Read-only text can still be selected/copied.
Each scope owns its SDK/history, current drag source and private command port. No SDK
object, native event or mutable extension escapes through a public prop.

EDITOR-NATIVE-004: Safe paste uses bounded literal text, explicit hard breaks or code
text; raw HTML and file drops never enter the SDK parser. Native block dragging trusts
only the current editor's private session. Drop targets must be siblings; one atomic
logical document is published and rejected host updates retain the previous value.
Keyboard move alternatives use the same pure reorder contract. Selection and focus are
restored through stable ids, not stale native offsets.

EDITOR-NATIVE-005: Toolbar changes use real SDK command availability and history. Tests
exercise typing, safe multiline paste, active marks, undo/redo, isolated sessions,
selection rejection, host document rejection and protection transitions. Browser proof
is separate and required for layout, focus, IME, dragging and accessibility semantics.

EDITOR-NATIVE-006: SDK startup failure is isolated to its nearest Editor boundary. A
real Retry editor action remounts only that native session using the latest controlled
host props. It does not reload the application, lose host drafts or disturb neighboring
editors/stores. Initialization/retry emits no document/edit callback. An editor-local
resource owner captures the SDK at beforeCreate and installs cleanup before the SDK's
creation effect, so even a partially constructed startup failure is disposed. Retry
never grants application code an SDK instance or native event.

EDITOR-NATIVE-007: Every schema-valid design template preserves editor containment,
including maximum spacing tokens at 240px and 200% text. Editor/SSR preview padding and
menu option padding/label margins respect the existing core padding-percentage limit;
large token values cannot force a minimum physical border box wider than its parent.
This rule changes neither the host template nor declaration structure. Browser coverage
uses actual server-rendered closed components and the built stylesheet, independently of
schema-only acceptance.

EDITOR-NATIVE-008: Resolve trusted FormField metadata before native session,
selection publication and command/menu/drop port creation. Inherited disabled OR
cannot be undone by Editor disabled=false. Portal inactivity and existing readonly
protection remain independent. Native contenteditable, tab order and aria-disabled
must reflect the effective protection; native fieldset disabling alone is not enough.
Host reenable/value/selection changes reconcile quietly without a user callback.

EDITOR-NATIVE-009: Merge inherited description/error IDs with Editor guidance and
expose controlled outer error as aria-invalid. FormField owns its error alert;
Editor must not duplicate that text or create a second error state. Metadata does
not introduce Editor name, required, FormData or raw SDK props. Readonly selection
inspection, unrelated controls, independent stores and SSR behavior stay intact.
