# Existing control consumer integration

Status: correction in progress after the complete 2577-test diagnostic run. Sixteen
cases failed in fourteen files; original output is preserved in
.cache/final-whole-coverage.log and final-unit-failure-briefs.txt.

The updated single Select exposes asynchronous named popup lists. Existing consumer
journeys must await the actual requested option and collapsed/removed popup before the
next opening. Preserve every selected value, callback, filter, page and example outcome.
Do not add sleeps, raise timeouts, select hidden items or alter production behavior to
satisfy a stale discovery query.

Base Slider exposes a native range input labelled by its logical control name; the group
retains the displayed value. JSDOM cannot discover its visible thumb until it has
nonzero geometry. Reuse the existing scoped test-support layout fixture, restore it
after each case, and retain actual keyboard value/direction assertions. Browser
conformance continues to verify physical geometry without those mocks.

Portalled Select direction is inherited from its trusted positioner rather than a dir
attribute on the list itself. Assert the nearest semantic direction ancestor and
preserve RTL/LTR keyboard assertions, including nested App scope precedence. These are
consumer acceptance updates, not new public contracts or coverage escapes.

The first scoped run passed all new preview checks and all four repaired Slider/App
cases, but twelve Select journeys failed an added DOM-unmount assertion. A focused probe
shows aria-expanded=false, the updated trigger value and the SDK's data-closed
positioner with pointer-events:none. Base UI retains the exiting popup node in JSDOM.
Consumers now await the actual option and public collapsed state before reopening; they
retain every original business outcome and the added selected-trigger assertion. The
overconstrained unmount assumption is not reported as a framework runtime defect.
Evidence: .cache/select-close-probe.log and .cache/docs-preview-coverage.log.

Final scoped run: 43 tests pass across all fourteen files. Four strict TypeScript
projects, explicit typed lint and source policy also pass. No production runtime,
callbacks, values, assertions of business outcomes or timeout values were changed.
