# Agent B Slider enterprise extension

Date: 2026-10-29. Source: fork-b. Scope: SLIDER-001 through SLIDER-013. This is verified
snapshot work; root acceptance remains a separate parent gate.

Preserve single-number callers and add explicit range {start,end}, horizontal/vertical,
readOnly, description, names and field metadata. Canonical callbacks receive one finite
number or frozen ordered DTO. Minimum/maximum identities cannot swap or push each other.
Keyboard, RTL, pointer editing and declined writes preserve controlled data. Canonical
form serialization uses name for scalar and name.start/name.end for interval values.

The installed Base UI Slider provides native range inputs and indexed SSR thumbs.
Private exact inputRef sets/removes reactive aria-readonly and aria-invalid because the
SDK does not forward those semantic attributes to its native input. No DOM queries,
public DOM props, native events or SDK arrays escape the trusted adapter. Invalid or
protected SDK proposals are canceled before host callbacks.

Core slider-numeric centralizes the supported numeric capability: at most twelve
fraction digits, finite positive span and percentage/step quotient arithmetic, and
representable increments at both bounds. This matches the installed SDK range precision
without silently rounding canonical data. Primary props, nodes, host constraints and SDK
proposals share that contract. Initial off-grid values stay exact; the first edit uses
the min-origin step grid. General numberRange remains unrestricted.

Parent integrated own sliderNodeSchema/sliderNodeBindings, BoundSlider, CSS and the
compiled SliderExample. Root NumberRange type export is an agreed additive integration
requirement, SLIDER-013; parent owns its root barrel and package/type acceptance.
NumberRangeBounds/isOrderedNumberRange may also be additive general data utilities. The
earlier immutable number-range foundation and slider.md are not overwritten here.

Red acceptance: slider-schema-before.log, slider-adapter-before.log,
slider-request-before.log, slider-bound-before.log and slider-numeric-before.log.
Reactive stale semantics failed in slider-semantics-red.log before removal was fixed.
Final combined owned coverage passes 55 tests across 21 files in
forms-owned-coverage.log. All 12 executable owned files reach 100% all four metrics: 106
statements, 82 branches, 27 functions and 99 lines. Report:
.cache/coverage-forms-owned/coverage-summary.json. Global unrelated unexercised files
still exit 1 under unchanged thresholds and includes.

Whole four-project types pass in forms-owned-final-types.log; no-ignore typed lint has
zero diagnostics across 56 combined files in forms-owned-final-lint.json. The test-only
metadata-name typing correction passes six affected tests in a separate
forms-test-typing-regressions.log without runtime changes.

Official build passes in .cache/forms-final-build.log. All 54 Chromium scenarios pass in
forms-final-browser.log, including ten Slider scenarios for both templates at
240/360/768/1440, 200% text, RTL, vertical controls, pointer, keyboard collision, native
data and readonly/disabled behavior. Inspected slider-{compact,spacious}-final.png in
.cache. Schema validation is not a browser correctness proof.

All maintained owned files satisfy 300 lines, 88 columns and two spaces. Cache artifacts
retain tool formats. No dependency changes, vendor edits, commits, remote writes,
publication or DNS changes belong to this batch. Parent owns final root acceptance.
