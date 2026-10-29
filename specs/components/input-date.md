# InputDate

Status: implemented and focused-verified in Agent B's isolated snapshot. Root
integration and combined project acceptance remain separate gates.

INPUT-DATE-001: Expose a dedicated named InputDateProps, strict schema and InputDate TSX
module. Require label, controlled value, onValueChange and a canonical non-null host
referenceDate. Default single mode accepts Gregorian YYYY-MM-DD or null. Explicit range
mode accepts readonly start/end endpoints, each canonical or null, with a matching
callback. No SDK object, native event, HTML, CSS or styling escape is public.

INPUT-DATE-002: Accept optional description, locale, inclusive min/max, name, required,
disabled and readOnly. Apply the date-time foundation's lexical/calendar validity,
ordered bounds and partial range rules. A nonempty endpoint must fit bounds. Complete
ranges are ordered; equal endpoints are valid. referenceDate is a placeholder/focus
anchor rather than a committed value and may lie outside the value bounds.

INPUT-DATE-003: The shadcn adapter privately uses React Aria DateField with day
precision and forced leading zeros. A supported locale defaults explicitly to en-US.
Force the Gregorian calendar through the locale's calendar extension so public ISO
values remain Gregorian even when the locale normally uses another calendar. SDK values,
limits and placeholder references are memoized. No ambient date, locale or timezone
chooses data or initial markup. referenceDate supplies the empty field reference
explicitly.

INPUT-DATE-004: Numeric typing and Up/Down edit date segments; Left/Right and Tab follow
the numeric locale order. App.direction controls outer layout independently. Keep locale
numeric bidi intact inside the field. Native form data uses canonical dates, with
name.start/name.end for ranges. SDK objects stay inside the adapter. No calendar popup
is implicit; applications compose the separate Calendar component when needed.

INPUT-DATE-005: Each endpoint has an accessible clear action. Disabled/readOnly never
request writes. Valid edits remain controlled when declined by the host. Reject
out-of-bounds dates and reversed complete ranges with associated feedback. Incomplete
segments remain adapter drafts; they must not enter canonical state as invalid dates.

INPUT-DATE-006: Native validity follows visible draft completeness. Optional fully empty
state may submit. Nonempty incomplete drafts block submission even when optional;
required single values and both range endpoints must be complete. Old committed values
must not mask missing visible segments. A declined clear must restore visible canonical
state or remain blocked. Invalid submission announces the field and focuses its first
missing editable segment through a scoped DateInput ref, never a global DOM query.

INPUT-DATE-007: Generative 0.2 binds to date or dateRange state according to mode, with
explicit read/readWrite access. Read mode forces readOnly. Component limits register
shared state constraints so host writes cannot bypass another bound field. Independent
app/SSR stores remain isolated. The generative leaf is one strict type-discriminated
object with optional single/range enum; the primary TSX schema retains a mode union.

INPUT-DATE-008: Acceptance covers canonical schema/type rejection, leap dates, keyboard
edits, partial/reversed ranges, bounds, host rejection, clear/protection, required and
optional draft validity, native FormData, deterministic SSR/hydration, forced Gregorian
locale behavior, both templates and narrow/200%/RTL containment. Every owned executable
file needs 100% statements, branches, functions and lines. Record browser evidence
separately; schema validity is not browser proof.

INPUT-DATE-009: Preserve unfinished local drafts across unrelated host rerenders and
same-value controlled updates. An explicit host reset that must discard a draft without
changing the canonical value changes the component's React key. The runnable example's
Restore action resets both canonical state and field identities, including a missing
month whose committed date already equals the sample date. Standard React identity does
not expose styling or native markup.

INPUT-DATE-010: Private draft focus and minimum touch geometry support both spinbutton
and textbox roles used by the upstream segmented primitive. Role compatibility is
covered at the scoped focus-helper boundary; Chromium checks verify actual desktop
rendering. These checks do not claim Safari/iOS conformance without that browser run.

References checked 2026-10-29:

- https://ui.nuxt.com/docs/components/input-date
- https://react-aria.adobe.com/DateField
- https://react-aria.adobe.com/internationalized/date/CalendarDate.html
- https://ui.shadcn.com/docs/components/base/input-group

Nuxt's SDK-valued uncontrolled state becomes canonical controlled host data. Cosmetic
variants, slots, arbitrary calendar systems and browser events are outside this closed
contract. Date-time and timezone selection belong to explicit higher-level domain
composition rather than implicit timestamp coercion.

## Snapshot verification

2026-10-29: 52 focused tests pass across twelve files. Thirteen nonempty production
files, including the modified shared policy, have 100% statement, branch, function and
line coverage: 115 statements, 108 lines, 100 branches and 42 functions. The unchanged
global coverage run exits nonzero only for unrelated unexercised paths. Reports:
`.cache/input-date-coverage.log` and `.cache/coverage-input-date/coverage-summary.json`.

Full snapshot four-project TypeScript 7 checks pass in
`.cache/input-date-final-types.log`. Scoped `--no-ignore --type-aware` lint reports zero
diagnostics across 28 files in `.cache/input-date-final-lint.json`. All owned maintained
paths satisfy the 300-line, 88-column and two-space rules.

The parent production build and all ten InputDate Chromium cases pass in
`.cache/b-updated-build.log` and `.cache/b-updated-browser.log`. The combined browser
invocation has unrelated Chat failures; the ten Date cases all pass. Both profiles and
240/360/768/1440px widths preserve containment at normal and 200% text, App RTL and
locale bidi. Visible segments meet 44px targets. Keyboard edits preserve leap-date
state, range and committed-partial invalid submission focus missing fields, Arabic
editing works, protected controls stay disabled and interaction cases have no page
errors.

SSR/hydration changes the ambient clock/timezone, including a skipped-day timezone,
without changing the explicit Gregorian date or reporting recoverable errors. The
earliest supported year and a future host reference date are exercised separately.
Generative transport tests verify isolated server/client stores and shared constraints.

Negative evidence: `.cache/input-date-before.log`,
`.cache/input-date-adapter-before.log`, `.cache/input-date-example-before.log` and
`.cache/input-date-restore-before.log`. The Restore regression initially failed when
canonical sample data was unchanged; `.cache/input-date-restore-after.log` proves the
explicit identity reset. Complete root packaging, schema freshness, MkDocs and combined
coverage/browser acceptance remain Agent A's integration responsibility.

## Controlled temporal recovery

INPUT-DATE-011: Native range reset requests the complete initial canonical range once,
not separate endpoint updates. It honors current bounds, host rejection, readonly and
disabled protection. It never cancels native reset of unrelated form fields. The two
visible endpoints and native values retain authoritative controlled data after a
declined reset. Reset belongs to the nearest actual native form. When reset recreates
an active segment, restore its corresponding meaningful segment without scrolling.
Do not replace focus deliberately moved by the host.

INPUT-DATE-011-RECOVERY: Rejected-edit feedback expires after a valid controlled value
or limit change. New object identity with the same endpoint values and limits does not
clear feedback or an unfinished draft. Recovery never commits an old rejected candidate.
Native reset may explicitly discard drafts; ordinary host rerenders must preserve them.
SSR and independent instances remain isolated.

Acceptance: atomic range reset, unrelated native field reset, host rejection, changed
limits, readonly/disabled, same-value rerenders, partial drafts, valid external
replacement and actual native browser form submission.

## FormField metadata adoption

INPUT-DATE-012: Single and range controls consume trusted FormField metadata.
An explicit name or required flag overrides its nearest scope default; disabled
combines with OR. The same effective flags protect segmented SDK editing, clear and
reset requests, draft validation and canonical native form bridges. A disabled scope
must not emit changes through contenteditable segments even though native fieldset
omission already excludes its values. Range names retain .start/.end suffixes.

Associate scoped descriptions and controlled errors with the segmented field while
preserving its own description and draft feedback. Reflect scope invalid/disabled
state through SDK accessibility flags. Render the group's error once. Clearing scope
feedback must update accessibility without remounting or changing canonical values.

Acceptance includes direct and generative disabled scope keyboard requests, explicit
false flags, inherited and overridden names/required values, range native data, scoped
feedback recovery and retained atomic reset/rejected-edit recovery. Browser evidence
is required for actual contenteditable disabled behavior.
