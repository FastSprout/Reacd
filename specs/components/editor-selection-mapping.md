# Private editor selection mapping

EDITOR-SELECTION-001: Public selection uses blockId and UTF16 logical offset. Private
SDK positions remain inside the adapter. Map paragraphs, headings and code blocks,
including nested quote/list children. Native inline atoms and hard breaks count one;
text counts UTF16 code units. Preserve anchor/focus order for reversed ranges.

EDITOR-SELECTION-002: Guard the native document budget before traversal. Only editable
blocks with canonical stateKeySchema ids participate. Missing ids are skipped; malformed
native documents, duplicate editable ids and unsupported roots fail closed. Do not
allocate unbounded position arrays, expose SDK objects or mutate input documents.

EDITOR-SELECTION-003: Valid native gaps and node selections snap to the nearest editable
point. Equal distances choose the first block in document order. An empty editable block
has one valid offset, zero. A document with no editable block maps to undefined. Reject
noninteger or outside-document native endpoints.

EDITOR-SELECTION-004: Domain endpoints must identify editable blocks with integral
nonnegative offsets no larger than the exact block content length. Invalid mappings
return Result issues at Editor.selection, without SDK data. Successful domain selections
and both endpoint objects are frozen; native projection returns frozen numeric points.

Acceptance uses actual ProseMirror schema/selection objects, atoms, surrogate pairs,
empty blocks, nested containers, reversed ranges, gaps and rejected malformed inputs.
This pure mapping acceptance does not prove browser focus or rendering correctness.
