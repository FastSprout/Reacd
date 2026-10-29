# Agent B optional Editor transport

Date: 2026-10-29. Source: fork-b. Scope: EDITOR-GEN-001 through EDITOR-GEN-006. Verified
schema/state-projection snapshot only; native/central acceptance is pending. Primary
authoring stays TSX. No native editor implementation is included in this batch.

New schema/editor/generative.schema.ts exports editorNodeBaseSchema, EditorNode<Child>,
createEditorNodeSchema(child) and editorNodeBindings(node). The strict node reuses
editorOptionsSchema, accepts only a richDocument read/readWrite reference, and has
optional readonly recursive toolbar/children arrays using the existing document child
budget. Selection and callbacks are not transported. Both recursive slots must be
validated and traversed before native mounting.

New schema/editor-toolbar/generative.schema.ts exports editorToolbarNodeSchema. It
extends the existing closed literal toolbar options: bounded unique commands, safe link
hrefs and optional labels/disabled intent. No new command actions, bindings or slots.
The readonly leaf participates in a discriminator union without casts.

New state/generative-ui/bound-editor.tsx exports BoundEditor. Its props accept the node
without raw toolbar/children slots, registry and separately rendered React slots. It
resolves the exact editorDocumentSchema, reports invalid bindings before constructing an
Editor, forces read bindings to readOnly, and blocks literal readOnly/disabled writes.
Host changes remain authoritative; invalid document proposals do not publish.
Independent registries and server projections remain isolated.

Red tests were recorded before implementation in editor-generative-before.log and
editor-generative-bound-before.log under .cache. Final nine tests in four files pass in
.cache/editor-generative-final-tests.log. Coverage report:
.cache/coverage-editor-generative/coverage-summary.json. All three runtime files have
100% statements, branches, functions and lines: 16 statements, eight branches, five
functions and 14 lines. The unchanged global coverage gates additionally report
unrelated unexercised files and exit 1; no thresholds or coverage paths were changed.

Typed no-ignore lint passes for all seven owned source/test files with zero diagnostics
in .cache/editor-generative-lint.json. Strict scoped TS7 passes in
.cache/editor-generative-scoped-types.log, using editor-generative-tsconfig.json in
.cache. It inherits all root strict/exact settings and checks every owned source/test
plus existing matcher declarations and their imported dependencies. The whole-project
attempt in editor-generative-types.log is blocked by unfinished native
editor/plain-paste tests owned elsewhere; it has no owned-file diagnostic. Parent owns
the combined gate.

Bound tests deliberately stub only the Editor component boundary. They prove state
projection, protection, invalid-write rejection, logical slot forwarding and SSR store
isolation; they do not prove native typing, SDK reconciliation, hydration or browser
rendering. Parent must run those after the native adapter is ready.

Parent integration proposal:

- Add EditorNode<GenerativeNode> directly to the central recursive type, without an
  intermediate recursive union alias.
- Register createEditorNodeSchema(generativeNodeSchema) inside the lazy recursive
  schema.
- Register editorToolbarNodeSchema as a literal leaf and map it to EditorToolbar.
- Delegate Editor state contracts to editorNodeBindings; visit toolbar and children for
  recursive validation, action references and state binding collection.
- Render both slots through NodeView and pass the resulting React nodes to BoundEditor.
- Add schema/state barrel re-exports and real central transport/native acceptance only
  when the native adapter is ready. No new state/action kind or dependency is needed.

Every included path is new. Existing Editor schemas/index barrels, core document/port,
native adapters, SDK, state infrastructure and central aggregates were left untouched.
Maintained owned files satisfy 300 lines, 88 columns and two spaces. Generated cache
reports/config retain tool formats. All work is local; no commits, remote writes,
publication, deployment or DNS changes.
