# InputTime

TIME-MOBILE-001: The trusted adapter supports both spinbutton and textbox editable
segment roles emitted by React Aria for different accessibility platforms. Missing
segment focus stays scoped to this field and both roles retain minimum touch targets.
Unit role-compatibility evidence and Chromium checks are separate from actual iOS
browser conformance; neither implies that Safari has been verified.

Status: implemented and focused-verified in Agent B's isolated snapshot. Root
integration and combined acceptance remain separate.

INPUT-TIME-001: Provide a dedicated strict schema, named inferred InputTimeProps and
InputTime TSX module. Require label, controlled value and onValueChange. Default single
mode accepts a canonical `HH:mm:ss` string or null. Explicit `mode="range"` accepts a
readonly `{start: string | null, end: string | null}` DTO with a matching callback.
Reject mismatched modes, unknown props, raw styles, DOM events and SDK date objects.

INPUT-TIME-002: Accept description, locale, inclusive min/max, name, required, disabled
and readOnly. Use the date-time foundation's canonical values, ordered bounds and
partial range rules. Never request a noncanonical or out-of-bounds value. Never request
a reversed complete range; announce that rejected edit using an associated error.
Controlled props remain authoritative when a host declines a valid write.

INPUT-TIME-003: The trusted shadcn adapter uses React Aria segmented TimeField controls.
Named policy fixes 24-hour display, second precision, forced leading zeros and explicit
midnight placeholder. Locale defaults to en-US; no ambient locale, clock or timezone
chooses markup. SDK Time conversion is private. Field labels and descriptions wrap. Use
theme tokens for spacing, borders, focus, colors and minimum control target.

INPUT-TIME-004: ArrowUp/Down and numeric typing edit each segment; Left/Right and Tab
navigate according to the locale's native segmented numeric order. App.direction
controls outer layout and clear-button placement, while the explicit locale controls
numeric bidi/segment order. English numeric time remains left to right inside an RTL
App; Arabic uses its localized numeric ordering. Do not rewrite locale to mimic App
direction. Test computed field and numeric directions separately.

INPUT-TIME-005: Provide an accessible clear action for each time endpoint. Clearing
requests null, preserves focus, and resets partial segment drafts only after the host
accepts the cleared value. Disabled/readOnly controls never request writes. Partial
segments remain adapter draft data; complete canonical endpoints enter state. Required
controls reject empty or partially entered submission and focus the incomplete visible
segment. Range mode requires both endpoints. Native form names are name for single mode
and name.start/name.end for ranges; serialized values are canonical strings.

INPUT-TIME-006: Generative 0.2 uses time-kind bindings in single mode and timeRange-kind
bindings in range mode, with explicit read/readWrite mode. Read binding forces readOnly.
Control limits register as shared constraints. An invalid or declined write never
dispatches completion actions. Isolated stores/SSR requests remain isolated. Shared
registration is reviewed centrally rather than added implicitly by a component module.

INPUT-TIME-007: Acceptance covers strict schema/type failures, canonical value edits,
partial range editing, reversed/bounded rejection, host rejection, clear behavior,
required native submission and focus, labels/descriptions/errors, disabled/readOnly,
locale/App direction, SSR/hydration, both themes and 200% text/narrow-screen
containment. Require 100% per-file statement/branch/function/line coverage. Browser
behavior remains separate evidence, never inferred from schemas.

References checked 2026-10-29:

- https://ui.nuxt.com/docs/components/input-time
- https://react-aria.adobe.com/TimeField
- https://react-aria.adobe.com/internationalized/date/Time.html
- https://ui.shadcn.com/docs/components/base/input-group

Nuxt's SDK-valued/uncontrolled state becomes canonical controlled host data. Cosmetic
variants, arbitrary slots and DOM event passthrough belong to the adapter, not the
application API. This initial contract deliberately fixes 24-hour second precision;
configurable hour cycle and granularity are not claimed.

INPUT-TIME-008: Private React Aria values use a named fixed anchor date and UTC timezone
with the timezone hidden. This prevents the vendor's plain-Time conversion from choosing
today in the host timezone and normalizing a wall-clock time through a DST gap. UTC is
only a rendering anchor, never the meaning of the public timezone-free value. Callbacks
convert anchored SDK values back to canonical local time. Vendor default evaluation may
read an ignored ambient date; no application-visible value or markup depends on it.
Verify SSR/hydration across differing ambient host timezones, including DST-gap hours.

INPUT-TIME-009: Native form validity observes the visible segmented draft, not only its
previous committed value. A partially entered nonempty endpoint blocks submission even
when optional; a completely empty optional endpoint may submit. Required endpoints must
be complete. If an existing committed hour is cleared, the old nonnull value must not
mask incomplete submission. Preserve canonical committed FormData separately, announce
the incomplete field and focus its first placeholder segment using its scoped ref. An
entirely cleared optional draft may submit only when its committed value is also null.
If the host rejects clearing and retains a nonnull value, blank visible segments must
not silently submit that old value. Block submission until state and draft agree.

## Snapshot acceptance

2026-10-29: Combined foundation/InputTime execution passes 106 tests across sixteen
files. Nineteen nonempty owned production files have 100% statement, branch, function
and line coverage: 141 statements, 135 lines, 133 branches and 54 functions. The global
coverage configuration is unchanged; unrelated unexercised paths make the focused
coverage command exit nonzero. Empty barrels and type-only modules have no executable
totals. Logs: `.cache/input-time-final-coverage.log` and
`.cache/coverage-input-time-final/coverage-summary.json`.

Full snapshot `npm run typecheck` passes all four project configurations in
`.cache/input-time-final-types.log`. Scoped `oxlint --no-ignore --type-aware` reports
zero diagnostics across 40 owned source/test files in
`.cache/input-time-final-lint.json`. No library-check suppression or dependency patch
was introduced. Official public React Aria subpath imports avoid unrelated incompatible
declaration exports.

The parent ran production build and ten InputTime Chromium scenarios successfully as
part of thirty Calendar/InputTime/FieldGroup cases on worker port 4176. Evidence:
`.cache/b-controls-browser.log`. Both profiles and 240/360/768/1440px widths pass
containment at normal and 200% text, App RTL, locale bidi and 44px segment targets.
Keyboard edits update canonical state, required incomplete range submission focuses the
empty endpoint, Arabic edits work, protected actions stay disabled and interaction cases
report no page errors. SSR tests separately change ambient clock/timezone and hydrate a
DST-gap wall-clock value without recoverable errors.

The ten-scenario browser rerun also passes the added committed-partial submission
assertion: `.cache/b-time-fixed-build.log` and `.cache/b-time-fixed-browser.log`. The
new behavior is additionally proven by eight focused tests, including optional nonempty
drafts, accepted/declined complete clearing, scoped focus, associated feedback and the
native projection's stale-value guard. Negative evidence:
`.cache/time-partial-validation-before.log`; corrected focused evidence:
`.cache/time-host-clear-after.log` and the final combined coverage run above.

## Controlled temporal recovery

INPUT-TIME-010: Native range reset requests the complete initial canonical range once,
not separate endpoint updates. It honors current bounds, host rejection, readonly and
disabled protection. It never cancels native reset of unrelated form fields. The two
visible endpoints and native values retain authoritative controlled data after a
declined reset. Reset belongs to the nearest actual native form. When reset recreates an
active segment, restore its corresponding meaningful segment without scrolling. Do not
replace focus deliberately moved by the host.

INPUT-TIME-010-RECOVERY: Rejected-edit feedback expires after a valid controlled value
or limit change. New object identity with the same endpoint values and limits does not
clear feedback or an unfinished draft. Recovery never commits an old rejected candidate.
Native reset may explicitly discard drafts; ordinary host rerenders must preserve them.
SSR and independent instances remain isolated.

Acceptance: atomic range reset, unrelated native field reset, host rejection, changed
limits, readonly/disabled, same-value rerenders, partial drafts, valid external
replacement and actual native browser form submission.

## FormField metadata adoption

INPUT-TIME-011: Single and range controls consume trusted FormField metadata. An
explicit name or required flag overrides its nearest scope default; disabled combines
with OR. The same effective flags protect segmented SDK editing, clear and reset
requests, draft validation and canonical native form bridges. A disabled scope must not
emit changes through contenteditable segments even though native fieldset omission
already excludes its values. Range names retain .start/.end suffixes.

Associate scoped descriptions and controlled errors with the segmented field while
preserving its own description and draft feedback. Reflect scope invalid/disabled state
through SDK accessibility flags. Render the group's error once. Clearing scope feedback
must update accessibility without remounting or changing canonical values.

Acceptance includes direct and generative disabled scope keyboard requests, explicit
false flags, inherited and overridden names/required values, range native data, scoped
feedback recovery and retained atomic reset/rejected-edit recovery. Browser evidence is
required for actual contenteditable disabled behavior.

INPUT-TIME-013: Date and time segmented draft validity share one private algorithm and
completion sentinel. Component declarations remain independent. Acceptance retains
scoped placeholder focus, partial drafts, stale committed values and native validation.
