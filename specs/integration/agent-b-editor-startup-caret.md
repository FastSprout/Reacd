# Agent B: startup browser caret correction

Status: ready test-only overlay. Both profiles pass, including three repeated runs of
each profile on the same official production output. No application source or build
artifact changes are involved.

## Requirements and behavior

Implements STARTUP-BROWSER-005 while retaining STARTUP-BROWSER-001 through 004. A native
MutationObserver subclass still throws once only when observing ProseMirror. The test
still requires a trusted diagnostic, real Retry editor action, independent live reader,
quiet host replacement, latest controlled data after retry, one exact native edit and
preservation across a navigation round trip.

The original End shortcut did not establish a text-end caret under macOS Chromium and
inserted the suffix at the beginning. A select-all/ArrowRight revision still sometimes
typed while the actual selection covered the document. The startup, containment,
neighbor, retry and host-data assertions had already passed in both failures.

The corrected test waits until the genuine Document formatting/Bold capability is
enabled, focuses the editor, selects all with the platform-aware shortcut and collapses
with ArrowRight. It then polls the native selection itself: collapsed, inside the editor
and at the logical text end. Only then does it type the suffix. No SDK object, DOM
selection mutation, arbitrary delay, timeout increase or weakened numerical assertion
is added. This establishes the intended precondition rather than assuming a keystroke
has already established it.

## Evidence

- `.cache/editor-final-browser.log`: coordinator's initial production startup cases
  passed recovery assertions before failing suffix position under End behavior.
- `.cache/editor-final-browser-corrected.log`: one profile still typed against the
  document selection during the first select-all/ArrowRight attempt; the other passed.
- `.cache/editor-startup-caret-observed.log`: both final scenarios pass on a read-only
  preview of the unchanged official output at port 5197.
- `.cache/editor-startup-caret-repeat.log`: six scenarios pass using repeat-each 3,
  one worker, unchanged timeouts. This repeat specifically checks the observed race.
- `.cache/editor-startup-caret-lint.log` and
  `.cache/editor-startup-caret-policy.log`: explicit test lint and maintained-source
  policy pass without warnings or violations.

The temporary preview configuration initially used its cache directory as cwd and then
needed an explicit IPv4 host. Those attempts did not start browser acceptance and are
not described as product regressions. Final preview processes terminate after each
run. No output directory is rebuilt or modified by the test.

## Handoff

This overlay modifies the current startup test and its acceptance addendum and adds
this ledger. The original editor-startup-browser frozen batch remains unchanged.
The manifest includes exact baseline/final hashes. Apply this overlay after that batch,
merging deliberately if a baseline differs. The coordinator retains responsibility
for one final combined fresh-build browser proof after any native Editor changes.

Logs, browser artifacts, temporary configuration and manifests retain required formats
outside maintained-source limits. There are no production or dependency changes and no
coverage configuration changes. All work remains local without commits or publication.
