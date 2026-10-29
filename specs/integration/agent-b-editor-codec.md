# Private Editor codec delivery

This immutable batch implements EDITOR-CODEC-001 through EDITOR-CODEC-005. It depends
on the frozen editor-foundation and the coordinator's editor-identity-reorder helper.
It does not accept a catalog entry or include the native React session, menus or props.

## Included boundary

The owned codec exposes editorDocumentToSdk(document) and
editorDocumentFromSdk(nativeNode):Result<EditorDocument> only inside the adapter. Native
projection uses bounded actual SDK nodes, allowing legitimate persistent-node reuse
while rejecting current-ancestry cycles. It never publishes SDK JSON. Canonical marks,
Unicode-safe text chunks, ids, code, lists and atoms retain their closed DTO meanings.
Factories create separate SDK extensions per editor; command wrappers expose only the
closed private logical command vocabulary to renderer ports.

The coordinated B dependency pins are @tiptap/core, @tiptap/pm, @tiptap/react and
@tiptap/starter-kit 3.32.1. Package/lock integration is coordinator-owned. StarterKit
already supplies Link; no duplicate Link or Mention extension is registered. The
identity plugin is supplied by the coordinator's separate freeze, not copied here.

## Verification

- PASS: 18 tests across six owned test files: .cache/editor-codec-final.log, 3.02s.
  Real SDK schema round trips, invalid native nodes/links, positional budgets, shared
  SDK identity, Unicode boundaries, native serialization/parsing, safe atoms and real
  formatting/history commands are exercised.
- PASS: all 16 executable owned files have 100% statements, branches, functions and
  lines: 258 statements, 140 branches, 78 functions, 243 lines. Thresholds unchanged.
  Exact per-file counters: .cache/editor-codec-final-coverage/coverage-summary.json.
- PASS: production TypeScript 7 noEmit: .cache/editor-native-types.log.
- PASS: explicit no-ignore typed lint of every codec/config/command source/test and
  its isolated geometry fixture: .cache/editor-codec-lint.log.
- PASS: all maintained owned files satisfy 300 lines, 88 columns, two-space indentation
  and no tabs. Freeze manifests and coverage outputs retain generated JSON formatting.

The test-only geometry helper supplies JSDOM Range rectangles for semantic command
execution and restores them afterward. It is not evidence of browser layout or native
caret placement. All browser, controlled-session, menu and optional generative behavior
requires separate acceptance; schema validity never proves browser rendering.

## Integration

Import only the manifest's new owned paths after editor-foundation and the separate
identity plugin. Shared aggregate/package files are deliberately absent. This freeze
must remain immutable while the native adapter and menus continue in the working copy.
