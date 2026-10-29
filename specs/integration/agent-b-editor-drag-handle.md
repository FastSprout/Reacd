# Agent B: EditorDragHandle

Status: ready for local integration with pending combined Editor gates. Owned
implementation and baseline production browser acceptance are complete. The concurrent
remote Mention work prevents final combined test-project type verification. This batch
does not complete the enterprise catalog or authorize publication.

## Requirements and API

Implements DRAG-001 through DRAG-007. Public EditorDragHandle accepts a required label
and optional blockId and disabled. It resolves explicit or selected structural IDs
inside the trusted Editor scope. No SDK values, native events, arbitrary commands,
coordinates, rendering callbacks or styling props cross the public boundary.

The selection button also supports native dragging when a legal sibling move exists.
Distinct Move up and Move down controls provide keyboard alternatives. Nonmovable blocks
remain selectable. Scope, target and protection errors are explicit; protected actions
are disabled. Native form submission is not triggered by any control.

Private beginBlockDrag accepts the logical ID before a drag session starts. Named MIME
data contains only that ID. The Editor surface, owned by the Editor worker, performs
target hit-testing and commits one validated proposal. It requires its private session,
so a forged payload does not authorize movement. This module never duplicates the
document engine, reparents blocks or crosses sibling arrays.

End, Escape, unmount, target changes and protection changes release only the session
owned by this handle. Port rerenders and selection notifications preserve active
sessions. All private capability calls receive exactly logical arguments, never events.

Controlled selection uses the approved atomic EditorEdit value/selection pair and
onEditChange. Private selection uses value/onValueChange. The live example stores one
EditorEdit in Jotai; rejected proposals preserve the complete host state.

## Integration additions

Public exports: EditorDragHandle and EditorDragHandleProps. Schema exports:
editorDragHandlePropertiesSchema, editorDragHandleSchema and editorDragHandleNodeSchema.
Named behavioral defaults are EDITOR_DRAG_POLICY. Registry helper:
editorDragHandleEntries. Conformance fixture: EDITOR_DRAG_HANDLE_EXAMPLES.

The coordinator owns catalog/barrel additions, registry/fixture composition, leaf
transport union and node rendering, style import, MkDocs navigation and demo mount.
The compiled EditorDragHandleExample is mounted once under Content and data. Optional
generative transport uses closed literal properties within Editor and adds no state
kind. No dependency was added. Merge additions into current shared files rather than
replacing aggregates from this snapshot.

## Verification

- `.cache/editor-drag-coverage-final.log`: fourteen tests across six files pass.
  Eight owned executable files have 100% statements, branches, functions and lines:
  74 statements, 47 branches, 19 functions and 66 lines, including the docs runtime.
- Coverage include/exclude settings and thresholds remain unchanged. The focused run
  exits nonzero for unrelated unexercised files; owned per-file metrics come from
  `.cache/editor-drag-coverage-final/coverage-summary.json`.
- `.cache/editor-drag-lint-final.log`: explicit owned paths pass type-aware lint with
  no warnings. `.cache/editor-drag-policy.log` contains no owned source violations.
- `.cache/editor-drag-docs.log`: strict local MkDocs build passes. Internal specs and
  this ledger remain outside public documentation.
- `.cache/editor-drag-types-final.log`: production declaration compilation passes;
  the shared test project then reports approved concurrent remote Mention work and an
  Editor hook fixture. The Editor owner subsequently corrected that hook fixture;
  remote schemas remain in progress. This is not a passing four-project check.
- `.cache/editor-drag-demo-types.log` and
  `.cache/editor-drag-docs-types-final.log`: demo and compiled examples pass against
  the freshly emitted declarations. The coordinator owns final combined strict types.
- `.cache/editor-drag-conformance.log`: all 101 exhaustive adapter tests pass,
  including the genuine Editor wrapper used by the DragHandle fixture.
- `.cache/editor-drag-transport-after.log`: a real GenerativeUI toolbar leaf updates
  shared richDocument state exactly once, disables read-bound controls, follows valid
  host replacements and preserves an independent registry.
- Genuine Editor integration tests verify accepted and rejected adjacent moves,
  selection continuity while editing, nested quote/list selection and selected
  separators. Scoped SSR hydration reports no recoverable errors or capability calls.
  Fake-port tests separately cover exact capability arguments and ownership.
- `.cache/editor-first-browser.log`: all ten DragHandle Chromium scenarios pass.
  Both templates cover 240/360/768/1440, true RTL, 200% text, keyboard moves, actual
  native pointer dragging, host rejection, protection, touch targets and page bounds.
- `.cache/editor-vendor-build.log` is the coordinator's passing official Editor build:
  fifteen chunks, largest 382,041 bytes, unchanged limits. Later shared Editor startup
  and remote-menu work requires another coordinated fresh build and integration run.
- `.cache/editor-drag-360.png` and `.cache/editor-drag-1440.png` were visually
  inspected. Labels wrap, controls remain contained and boundaries disable correctly.

## Regression evidence and limits

`.cache/editor-drag-before.log` records acceptance before the new modules existed.
`.cache/editor-drag-resource-before.log` captures a real repeated-start ownership bug:
canceling the old owner after accepting a new session canceled the new session too.
The adapter now releases its old session before requesting a new one.

`.cache/editor-drag-node-selection-before.log` captures a genuine shared Editor bug:
the default handle targeted a neighboring paragraph after selecting a separator.
The Editor worker corrected native structural NodeSelection reconciliation; the final
integration test verifies the separator moves while its adjacent paragraph does not.

A JSDOM native-drop attempt stopped at its unimplemented elementFromPoint API; that is
not a product regression or browser proof. The retained production Chromium scenario
performs the actual native drag. A transient namespace error in an SSR test was
corrected before the final passing run. Neither is described as an engine defect.
The first transport test incorrectly expected a zero-argument registry notification;
the documented subscription receives a logical key/kind/value DTO. The corrected test
asserts that exact DTO, with no runtime change.

This is a curated adaptation of Nuxt EditorDragHandle. It does not expose a general drag
framework, custom menus, custom drag payloads, SDK refs or arbitrary placement. Schema
validation proves the contract, not native rendering or pointer behavior.

Primary references:

- https://github.com/nuxt/ui/blob/v4/src/runtime/components/EditorDragHandle.vue
- https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API

## Local handoff

The frozen manifest lists only new owned paths and separate shared integration
proposals. Logs, screenshots, generated coverage and handoff artifacts retain their
tool-required formats and are excluded from maintained-source length rules. No runtime
source is excluded from coverage. All work stays local without commits or publication.
