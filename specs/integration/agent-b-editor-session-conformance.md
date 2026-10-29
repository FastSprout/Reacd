# Agent B: native Editor session conformance

Status: ready test-only contribution. Six new acceptance tests pass without production
changes. The Editor owner retains all implementation and final shared verification.

## Scope

Implements SESSION-CONFORMANCE-001 through SESSION-CONFORMANCE-004 in two new colocated
test modules. Real useEditorSession renderHook fixtures create the private SDK and use
its registered hooks. No application SDK exposure, runtime test hooks, fake renderers or
coverage exclusions are added.

Native paste tests cover stored bold marks across text/hard breaks, inherited italic
marks with no stored marks, normalized code newlines, empty paste and callback argument
exactness. Hidden/disabled transitions reject private changes and reconcile host data
quietly. Selection-only native snapshots of a temporarily stale document cannot produce
an atomic host edit. Returning to the exact host selection within the same
reconciliation turn emits no duplicate proposal.

Registered private drop acceptance covers local movement, consumed sessions, missing
targets, foreign targets, no-op placement and protected transitions. Structural
NodeSelection survives host reorder. Removing its block falls back to a valid logical
selection without stale IDs or business callbacks. Actual pointer hit-testing remains
the responsibility of the separate Chromium drag scenarios.

## Verification

- `.cache/editor-session-all-final.log`: all six new tests across two files pass.
- `.cache/editor-session-types.log`: a strict scoped TypeScript project extends every
  repository compiler option and compiles both new modules and their dependencies with
  no emit or suppression.
- `.cache/editor-session-lint-final.log`: explicit owned test paths pass type-aware
  lint without warnings. `.cache/editor-session-policy.log` contains no violations.
- `.cache/editor-session-coverage-final.log`: all 69 combined tests in 23 selected
  native session/SDK/renderer/toolbar/DragHandle files pass.
- `.cache/editor-session-target-coverage.json`: all six target production files have
  100% statements, branches, functions and lines: 133 statements, 126 branches,
  32 functions and 116 lines.

| Target | Statements | Branches | Functions | Lines |
| --- | ---: | ---: | ---: | ---: |
| use-editor-session | 75 | 76 | 12 | 65 |
| use-editor-port | 18 | 23 | 9 | 15 |
| drag-session | 20 | 19 | 4 | 19 |
| publish-edit | 7 | 4 | 1 | 6 |
| apply-paste | 5 | 4 | 2 | 5 |
| resources | 8 | 0 | 4 | 6 |

Coverage configuration is unchanged. The focused command exits nonzero for unrelated
unexercised files; it does not constitute a passing repository-wide coverage gate. Raw
coverage-final.json retains source counter maps. Initial combined coverage had one
uncovered session branch: returning to the host selection without another proposal.
The final real two-transaction test closes that case without mocking a callback or
constructing impossible public properties.

Three initial act callbacks returned the SDK's boolean command result, which type-aware
lint treats as a potentially floating thenable. Their bodies now explicitly return void.
Long test titles were shortened to meet source policy. These were harness issues, not
native runtime defects. Existing combined tests emit JSDOM scrollBy notices; they are
not browser layout assertions or production failures. No timeout was increased.

## Handoff

The manifest contains only four new owned paths: two tests, the acceptance addendum and
this ledger. There are no production, dependency, aggregate, shared-state or output
changes. Tool logs, coverage artifacts, temporary strict-project configuration and
manifests retain their required formats outside maintained-source limits. No production
source is excluded from coverage. Final combined tests, types and browser acceptance
remain coordinator-owned. All work stays local without commits or publication.
