# Editor block reorder

EDITOR-MOVE-001: Pure core helpers receive an already validated bounded EditorDocument.
editorBlockMoves(document, id) returns named up/down availability. moveEditorBlock takes
the same document, a stable block/list-item id and the closed up/down direction, then
returns Result<EditorDocument>. No schema, SDK, DOM or state imports enter this layer.

EDITOR-MOVE-002: Move only one position within the nearest sibling array: document
blocks, quote children, list-item children or list items. Never reparent or cross an
array boundary. Preserve every id, inline value, ordered-list start and unrelated node.
Unknown ids and boundary moves return diagnostics instead of silently succeeding.

EDITOR-MOVE-003: A list item's first child remains a paragraph. Reject a move that would
place another block type first. Two paragraphs may exchange positions. Availability uses
the same acceptance rules as execution, including nested containers and list items.

EDITOR-MOVE-004: Input is never mutated. New arrays, changed containers and the output
document are readonly snapshots; unchanged branches retain their identities. Selection
uses stable block ids/text offsets, so reorder does not rewrite its logical positions.
The adapter owns pointer drop targeting, SDK history and focus; this helper does not
claim a complete DragHandle implementation.

EDITOR-MOVE-005: Acceptance covers root/quote/list-item/list order, both directions,
boundaries, unknown ids, all supported leaf blocks, nested mixed lists, the paragraph
invariant, exact availability, identity preservation and schema-valid immutable output.
