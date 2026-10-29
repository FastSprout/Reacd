# Editor document foundation

Status: specified. This precedes Editor/Toolbar runtime implementation and does not
accept any catalog entry. Requirements refine the approved editor-proposal.md.

EDITOR-DOC-001: A rich document is a strict versioned DTO: version=1 and a nonempty
ordered blocks array. No HTML strings, styles, DOM objects, SDK classes or arbitrary
extension data appear in its structure. Stable block identifiers are unique across the
whole document, including containers and list items. Ordering is explicit in arrays.

EDITOR-DOC-002: Supported blocks are paragraph, heading, quote, codeBlock, bulletList,
orderedList and separator. Paragraph/heading contain inline arrays; headings allow
levels 1..3. Quote contains blocks. Lists contain listItem containers with block
children; a list item requires at least one paragraph before optional nested blocks.
Ordered lists have a bounded positive start value. Code blocks contain plain text and an
optional closed language enum. Separators contain only their stable id and type. Block
ids use the existing bounded state-key alphabet without implying state identity.

EDITOR-DOC-003: Inline content is text, mention, emoji or hardBreak. Text accepts only
closed bold/italic/strike/underline/code marks plus safe link metadata. Marks are unique
per text node. Mentions carry a bounded id and label. Emoji values are bounded plain
Unicode text selected from the host's validated menu catalog; no images/HTML execute.
Hard breaks are explicit nodes. Inline nodes need no structural id; repeated inline
values are distinct JSON objects rather than shared object references.
Inline code is exclusive: a code-marked text node cannot carry other marks or a link.
Marks represent a set and normalize to the named core order; SDK mark ordering cannot
cause spurious controlled-value changes or reconciliation loops.

EDITOR-DOC-004: Named core budgets: maxDepth=16, maxValues=12000, maxCharacters=200000,
maxBlocks=256, maxChildren=100, maxInlines=2048, maxTextLength=100000,
maxEmojiLength=32, maxMarks=5, maxOrderedStart=10000. Maxima include nested values
rather than only top-level arrays. Preflight rejects oversized arrays before enqueueing
entries, checks depth before descending and rejects cycles/shared object graphs before
schema recursion, conversion or SDK startup.

EDITOR-DOC-005: External values remain unknown until preflight and strict validation
succeed. Preflight accepts finite JSON primitives and plain records/arrays, rejects
accessor-backed enumerable properties without invoking getters, and catches hostile
reflection failures. It rejects sparse arrays, nonfinite numbers, functions, symbols,
bigints and class instances. It counts property names and strings toward the aggregate
character budget. Traversal must not enqueue an entire oversized graph first.
After preflight, native structured cloning creates a plain bounded snapshot before Zod
reads properties. Uncloneable proxies fail validation without executing their get traps;
validation never continues against a mutable reflected source object.
Array lengths must also come from own data descriptors rather than property reads;
an array proxy's get trap must not run during bounded preflight.

EDITOR-DOC-006: Logical selection is anchor/focus {blockId, offset}. It resolves only to
editable text blocks in this document. Offsets are nonnegative integers no greater than
that block's logical inline length. Text/code use UTF-16 offsets, hardBreak counts one
and mention/emoji atom counts one. Container/separator positions are invalid. Ranges may
span blocks and may be reversed. Invalid selections are rejected before applying an SDK
transaction. SDK positions never appear in public state or props.

EDITOR-DOC-007: Initial richDocument state kind stores only validated rich documents.
Read-mode bindings prohibit edits. Optional controlled selection begins as a TSX DTO; no
separate selection state kind is introduced in this foundation. State registration is
coordinated only after the document schema and bounded unknown acceptance pass.

EDITOR-DOC-008: All conversion is downstream of this schema. Private SDK nodes undergo
a separate bounded native traversal and project into these exact structures before the
host's onValueChange. Text, structural order and stable ids survive round trips.
Missing ids
introduced by native typing receive deterministic per-editor allocation; no ambient
clock, random/global id counter or cross-request mutable registry is allowed.

EDITOR-DOC-009: Acceptance tests precede implementation and exercise valid nested
documents, duplicate ids, unsupported content/marks/URLs, zero/oversized/deep/sparse
collections, cycles and shared nodes, accessor safety, reflection failures, aggregate
text limits, selection boundaries/atoms/reversed ranges and independent documents. Every
production file retains 100% statement/branch/function/line coverage.

Dependency evidence: official TipTap React install and StarterKit documents plus npm
registry metadata retrieved 2026-10-29 support the coordinated 3.32.1 line for React,
core, pm and starter-kit. StarterKit already contains Link; duplicate registration is
forbidden. Closed reacd schema support determines which bundled features are enabled.
