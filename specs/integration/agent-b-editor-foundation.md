# Editor document foundation delivery

This immutable delivery implements EDITOR-DOC-001 through EDITOR-DOC-009 for the
pure document/selection contract. It does not accept an Editor catalog entry.
Primary authoring remains TSX; JSON is an optional bounded transport.

## Public foundation

Core exports EditorDocument, EditorBlock, EditorInline, EditorPosition and
EditorSelection with deeply readonly object properties and arrays. The schema module
exports editorDocumentSchema, editorPositionSchema and editorSelectionSchema(document).
The selection implementation also exports editorSelectionValueSchema for paired TSX
props. State integration consumes this exact document schema through richDocument;
the coordinator owns its shared registration and tests.

Named limits live in core/editor-policy.ts. Unknown external graphs are bounded before
schema recursion, reject shared references/accessors/proxies safely, and clone before
property reads. Block ids are globally unique; marks canonicalize in a closed order.
Logical offsets count UTF-16 text and one unit per atom/break. No SDK dependency is
needed by this pure foundation; it uses the existing Zod/shared validation baseline.

## Verification

- PASS: 14 focused tests across five files, including real AJV exported-schema
  validation, hostile graphs, budgets, canonical marks, invalid URLs and selections.
  Evidence: .cache/editor-foundation-final.log (2.53 seconds).
- PASS: every executable owned file has 100% statements, branches, functions and
  lines: eight files, 127 statements, 89 branches, 21 functions and 109 lines.
  Two type-only/barrel files contain no executable counters. Thresholds were unchanged.
  Exact counters: .cache/editor-foundation-coverage/coverage-summary.json.
- PASS: production TypeScript 7 with strict/exact optional flags:
  .cache/editor-foundation-types.log. The focused types test also accepts only readonly
  keys in every nested DTO; no suppression or cast bypass is used.
- PASS: explicit no-ignore typed lint of all 15 owned source/test paths:
  .cache/editor-foundation-lint.log.
- PASS: all owned files obey 300 lines, 88 columns and two-space indentation.
  The generated manifest and coverage artifacts retain their required JSON format.

Tests were authored before behavior changes. Preserved red evidence includes hostile
proxy reads, noncanonical marks, inline code exclusivity and aggregate selection offsets
in .cache/editor-proxy-before.log, .cache/editor-mark-order-before.log,
.cache/editor-code-marks-before.log and .cache/editor-selection-offset-before.log.

No browser assertion is made for a pure data contract. Native rendering, controlled
editing, optional generative state integration, SDK conversion, menus and documentation
previews remain separate work. Schema validity does not prove browser rendering.

## Integration

The freeze manifest lists new component-owned paths only, with exact SHA-256 hashes.
No shared aggregate is replaced. Import the foundation before coordinated richDocument
registration. Subsequent editor runtime additions may extend the named policy through
an explicit reviewed delta; this frozen proof remains immutable.
