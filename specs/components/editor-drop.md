# Atomic editor block drop

EDITOR-DROP-001: moveEditorBlockTo consumes a validated EditorDocument, source id,
target id and closed before/after placement. Both blocks must belong to the same nearest
sibling array: document blocks, quote children, list-item children or one list's items.
Moving into another container or editor is rejected. Missing identifiers are rejected.

EDITOR-DROP-002: Drop preserves all ids, payloads, relative order of other siblings and
unrelated branch identities. Input documents remain untouched. Source-equals-target and
already-adjacent placement return the exact original document as a successful no-op.
Changed results retain frozen document and array containers. Ordered list start remains
unchanged. A list item always keeps a paragraph as its first child.

EDITOR-DROP-003: Compose the bounded adjacent reorder operation privately and return one
final Result. Never publish intermediate documents or invoke application callbacks.
Rejected moves return the existing editor block diagnostics without a partial document.
The caller validates/commits once and owns native pointer hit testing and editor scope.

Acceptance covers forward/backward before/after movement, no-op identity, nested quote
children, ordered/bullet list items, list-item children, forbidden reparenting and first
paragraph protection. Pure data tests do not prove native pointer or keyboard behavior.
