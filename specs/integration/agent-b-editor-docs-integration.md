# Agent B Editor docs and native transport follow-up

Date: 2026-10-29. Source: fork-b. Scope: EDITOR-EXAMPLE-001 through EDITOR-EXAMPLE-004,
EDITOR-TRANSPORT-001 through EDITOR-TRANSPORT-003 and EDITOR-ATOMIC-001 through
EDITOR-ATOMIC-002. Snapshot verification is distinct from parent-owned final
browser/package/docs acceptance.

Public pages: docs/components/editor.md and editor-toolbar.md. They describe closed TSX
authoring, document data, controlled/private selection variants, readonly/disabled, SSR
projection and optional transport. Controlled selection uses one atomic EditorEdit
callback and excludes legacy separate callbacks; UTF-16 offsets and atom lengths are
explicit. Internal requirements and evidence remain outside docs.

Compiled examples:

- EditorExample: Jotai writer/shared reader, host replacement, rejected edit,
  protection, scoped RTL and quiet request count. Selection stays private.
- EditorToolbarExample: closed formatting/link/history items, nearest Editor scope,
  toolbar protection and host reset. Selection stays private.
- EditorControlledExample: atom<EditorEdit> stores document and selection together;
  accepted paragraph split/removal, rejected structural edit and whole-snapshot reset.

All examples use closed reacd TSX/Jotai only. Parent owns demo/nav registration. No new
dependency, app HTML/CSS, native refs, SDK instances or selection state kind is added.

Real editor-transport.test.tsx uses the registered GenerativeUI/native adapter without
Editor/SDK mocks. It proves quiet initialization, native typing and bold formatting,
shared readers, host replacement without echo, independent registries, readonly/disabled
protection, SSR preview and independent hydration without recoverable errors. A real
menu scenario types slash/at-sign/colon, selects each rendered option, and validates the
resulting heading/mention/emoji domain node. All three parent-owned menu routes execute.

Pure editor-traversal.test.ts accepts absent optional slots, records present toolbar and
children paths, and rejects missing state inside either slot. Shared native text-range
setup moved into new test-support/editor-selection.ts, used by the examples/transport.
It provides JSDOM interaction fixtures, not browser geometry assertions.

The approved one-file overlay narrows the original BoundEditor mock to the exact private
EditorProps variant after the atomic public union landed. Behavior assertions remain
unchanged. Its base hash matches the immutable editor-generative freeze. That earlier
nine-file artifact was not rewritten; all transport production code remains unchanged.

Red missing-example acceptance: .cache/editor-examples-before.log and
editor-controlled-before.log. Final coverage/test run:
.cache/editor-examples-final-coverage.log; 13 tests in six files pass. Three example
modules have 100% statements, branches, functions and lines: 48 statements, six
branches, 11 functions and 44 lines. Report:
.cache/coverage-editor-examples-final/coverage-summary.json. It also proves 100% of the
parent-owned EditorMenuNodeView routes and the earlier BoundEditor. Global unrelated
unexercised files still exit 1 under unchanged thresholds/includes; none were hidden.

The compiled examples and four real transport scenarios use the actual native adapter.
Only the earlier four BoundEditor boundary tests retain their deliberate Editor stub;
traversal tests validate data. Unit/native interaction proof does not establish browser
layout correctness. Parent owns the forthcoming unchanged-production browser matrix.

Typed no-ignore lint: .cache/editor-examples-lint.json, ten files and zero diagnostics.
Whole four-project strict TS7 passes in .cache/editor-first-complete-types.log,
including fresh dist and compiled closed-TSX examples. All 13 maintained owned paths
satisfy 300 lines, 88 columns and two-space indentation. Generated cache reports retain
formats. No native surface, menu/port, core schema, aggregate, CSS or package files were
coedited. All work stays local; no commits, remote writes, publication, deployment or
DNS changes.
