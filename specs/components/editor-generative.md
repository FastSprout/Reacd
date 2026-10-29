# Optional Editor generative transport

Status: schema/state projection verified in B snapshot; central/native acceptance
pending. Primary authoring remains closed TSX. This scope adds transport schemas and a
state binding projection; native editor acceptance belongs to Editor.

EDITOR-GEN-001: Editor transport is a strict object with type Editor, a required visible
label and a required richDocument state reference with explicit read/readWrite mode.
Description, placeholder, disabled and readOnly are literal closed values inherited from
editorOptionsSchema. No HTML, styles, classes, SDK objects, callbacks or arbitrary state
expressions are accepted.

EDITOR-GEN-002: Optional toolbar and children slots contain readonly recursive node
arrays bounded by the existing editor child policy. Export EditorNode<Child> and
createEditorNodeSchema(child). Parent integrates EditorNode<GenerativeNode> directly in
the recursive union, without an intermediate recursive union alias. The factory accepts
the central recursive child schema; global document preflight owns graph/depth budgets.
Both slots must participate in validation, traversal and rendering, including nested
state/action checks. Do not pass raw transport nodes as React children.

EDITOR-GEN-003: editorNodeBindings returns exactly one richDocument contract using the
existing editorDocumentSchema instance. Initial values, shared writes and adapter
proposals must satisfy that exact closed document contract. Unknown kinds, malformed
blocks, unsafe links, duplicate ids and unsupported data cannot become editor state.
Read references force readOnly even when a literal false was supplied. Literal disabled
and readOnly prevent projection callbacks from changing the document. Host writes remain
a separate controlled capability and update all readers without cross-store leakage.

EDITOR-GEN-004: BoundEditor accepts rendered toolbar/children separately from the typed
transport node and forwards only logical Editor properties. It resolves its state
binding with the exact document schema, renders diagnostics for invalid bindings, and
supplies one canonical document callback. It never exposes SDK selection, DOM events,
refs or private command ports. Public selection/onSelectionChange remain TSX-only; there
is no new selection state kind or selection transport property.

EDITOR-GEN-005: EditorToolbar transport extends the existing closed literal toolbar
contract with type EditorToolbar. Items remain bounded unique logical commands and safe
link values. No command actions, state references, extension objects, callbacks or
render slots are added. Parent registers this as a literal leaf only when the native
adapter is ready. A toolbar's live command port still comes from its nearest rendered
Editor.

EDITOR-GEN-006: Acceptance precedes implementation. Test strict fields, both recursive
slots, array limits/immutability, read/readWrite kind/schema identity, toolbar command
closure, binding failures, accepted/rejected document writes, literal protection and
isolated host registries. Initial component-boundary stubs prove state projection only;
they do not prove native editor behavior or browser rendering. Parent owns subsequent
central transport/hydration/browser integration when the native adapter is available.
Require 100% owned runtime statements, branches, functions and lines, strict TS7,
no-ignore typed lint and 300-line/88-column/two-space source policy.

Integration proposal: add direct EditorNode<GenerativeNode> to the central type and
createEditorNodeSchema(generativeNodeSchema) to the recursive schema; register the
literal editorToolbarNodeSchema leaf. Delegate Editor bindings to editorNodeBindings,
traverse toolbar and children, then render each slot through NodeView into BoundEditor.
No new action kind, state kind, dependency or public styling escape is required.
