# Private editor identity repair

EDITOR-ID-001: The trusted plugin preserves the first occurrence of every valid block
id. Native splits and pasted duplicate/missing ids receive editor-local monotonic
block-N ids. Scan all existing ids before allocation, including nodes reused at multiple
SDK positions. Never use a global counter, ambient time or random document ids.

EDITOR-ID-002: Guard the native document before traversal or repair allocation. Preview
all assigned ids and validate the repaired native projection budget before accepting the
transaction. Generated-id length is counted exactly, including long-lived counters.
Invalid nonempty external ids are rejected rather than normalized.

EDITOR-ID-003: The counter belongs to immutable private EditorState plugin state.
Replaying the same state and transaction is deterministic. Separate plugin instances are
isolated. Undo/redo does not roll the live counter backwards or duplicate ids. Identity
markup retains other node attributes and uses addToHistory=false.

EDITOR-ID-004: Private onRejected is optional and receives exactly zero arguments after
a rejected native change. Initialization, selection-only transactions and valid repairs
never call it. The adapter maps this to its local diagnostic; no business callbacks or
SDK objects enter public state. Repair does not append an infinite transaction loop.

EDITOR-ID-005: Selection-only transactions appended by other private plugins cannot
discard an outstanding document identity repair. Repair remains local to its plugin
instance and rejects transactions evaluated against an unrelated editor state.
