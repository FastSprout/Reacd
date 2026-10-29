# EditorDragHandle

Status: approved disjoint component proposal; acceptance precedes implementation.

DRAG-001: Provide closed TSX EditorDragHandle with required label and optional blockId
and disabled. It operates only within an Editor private scope. blockId defaults to the
scope's selectedBlockId. Resolve the logical structural ID against the already validated
bounded document, including nested blocks/list items. Missing scope, missing selection
or unknown IDs render explicit diagnostics. No SDK objects, DOM refs, coordinates,
styles, arbitrary commands or application callback props cross this boundary. A selected
non-editable structural node must not make the default handle target an adjacent
paragraph merely because the text-caret model snaps to an editable point.

DRAG-002: Expose selection and up/down controls with distinct textual accessible names.
The selection control is also a native draggable handle when a valid sibling move
exists. Its visible name explains selection and dragging. A block with no legal moves
remains selectable but does not advertise dragging. Up/down disabled states use the
private port's exact core-policy availability. Protected scope or local disabled state
prevents every capability call. All controls use type button inside surrounding forms.

DRAG-003: Native drag begins only when the private beginBlockDrag(id) capability
accepts. Reject stale/blocked starts with preventDefault. The private DataTransfer
payload uses only a named custom MIME and the validated ID, with move effect; no
document, SDK value or event is forwarded. The Editor surface owns native drop
hit-testing and one atomic controlled document proposal. External payloads alone never
authorize a move.

DRAG-004: End, Escape, unmount, target changes and protection changes cancel only the
session owned by this handle. A failed start does not leave resources or emit a cancel
for another handle. Plain port rerenders or selection notifications must not cancel a
valid active drag. Pointer movement never becomes public component state.

DRAG-005: Move requests pass only logical id/direction, and selection passes only id.
The scope's engine validates again, preserves stable IDs and selection offsets, never
reparents or crosses sibling arrays, and emits one complete Editor value per accepted
move. Host rejection keeps the controlled document. Native dragging and keyboard
alternatives share the same engine rules and readonly protection. Do not implement a
second document engine or claim full Nuxt menu parity. When the host controls selection,
it stores and accepts one atomic EditorEdit through onEditChange; the handle never
publishes separate document and selection callbacks.

DRAG-006: Fake-port acceptance covers missing/stale/nested IDs, selected versus explicit
targets, availability/boundaries, exact capability arguments, click/keyboard/form
safety, true/false drag starts, DataTransfer, cancellation ownership/lifecycle,
protection and SSR. Real Editor integration must additionally verify pointer drop,
keyboard moves, controlled rejection, selection continuity and read-only behavior
through its genuine surface. Verify both templates, narrow/200%/RTL and local
containment in production. Every owned executable file requires 100% statements,
branches, functions and lines.

DRAG-007: Public docs contain compiled TSX examples. Optional generative transport uses
literal closed properties inside Editor, with no additional state kind or raw action
handlers. A genuine GenerativeUI acceptance must place the literal toolbar handle in a
richDocument-bound Editor, verify one accepted move updates its registry, and verify a
read binding disables mutations while valid host replacements still render. Adapter and
catalog registration remains coordinated. Internal verification stays outside docs.

Primary references:

- https://github.com/nuxt/ui/blob/v4/src/runtime/components/EditorDragHandle.vue
- https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API
