# Agent B Editor menu conformance acceptance

Date: 2026-10-29. Test-only follow-up to EDITOR-MENU-002 through EDITOR-MENU-006 and
EDITOR-MENU-009. Native source remains Chat-owned. Previous lookup and example freezes
remain immutable; no component, schema, SDK or aggregate is changed here.

Three new colocated acceptance modules exercise actual TipTap Editor instances:

- menu-port-conformance: five cases cover missing/protected/duplicate/destroyed
  registration, live catalog refresh, rejected/inactive choices, teardown, reentrant
  query close and independent trigger ARIA ownership.
- menu-conformance: five React cases cover orphan/duplicate diagnostics, recovery,
  independent editor scopes and readonly/disabled typing and paste protection.
- menu-limits-conformance: three cases cover disabled-only navigation, composing keys,
  unmatched keys, query budget, code blocks and unsafe command capability.

The new test-support/editor-menu-fixture creates and disposes actual SDK editors. It has
no production dependency or mock SDK behavior. Existing editor geometry supports JSDOM
semantic interaction only. These tests do not prove browser layout. The IME acceptance
invokes the actual registered plugin's native key handler with an isComposing event; it
never replaces the plugin or command implementation.

The real ARIA regression was red in .cache/menu-port-conformance-second.log: releasing
inactive Mention removed active Emoji controls after SDK view recreation. Chat corrected
owned native teardown under EDITOR-MENU-009. The same test then passed without relaxing
its assertions or timeout. This overlay contains the test, not Chat's independent
runtime fix.

All 13 new cases pass in .cache/menu-conformance-current.log. Combined with actual
local/remote integration and parent store tests, 26 tests in six files pass in
.cache/menu-conformance-coverage.log. The unmodified global per-file thresholds still
make this focused run exit 1 for unrelated unexercised runtime modules. No
include/exclude/threshold, runtime visibility or coverage ignore was changed.

Focused report: .cache/menu-conformance-coverage/coverage-final.json and
coverage-summary.json. MenuPanel, MenuPort, MenuStore, useEditorMenu and the Mention
adapter each reach 100% statements, branches, functions and lines. MenuPlugin still has
statements 65 and 101 uncovered and branch counters at lines 65, 101 and 108. These are
disposed publish, inactive step and modulo fallback defenses. Exact counters were sent
to the native owner; this test-only freeze does not claim complete MenuPlugin coverage
or final catalog acceptance.

Strict TS7 whole tsconfig noEmit passes in .cache/b-final-test-overlays-types.log. Typed
no-ignore lint passes in .cache/b-final-test-overlays-lint.log. Actual source policy
reports [] in .cache/b-final-test-overlays-policy.json. Four owned TS paths satisfy 300
lines, 88 columns and two-space indentation. Generated cache artifacts retain their
required formats. Parent owns final full coverage/browser/package and documentation
gates. All work stays local with no commits or remote writes.
