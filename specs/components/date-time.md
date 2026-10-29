# Date and time foundation

Status: reviewed in Agent B's snapshot, implemented as core/schema foundation.
Component, adapter, state-registry and browser acceptance remain separate work.

## Canonical values

DATE-001: Public dates are canonical Gregorian calendar strings `YYYY-MM-DD` or null.
The supported inclusive years are 0001 through 9999, using the proleptic Gregorian leap
year rules. Dates have no time, timezone, UTC conversion, Date instance or SDK object.
Reject noncanonical padding, invalid dates, year zero, signs, whitespace and timestamps.
Do not normalize invalid dates into another month.

TIME-001: Public local times are canonical strings `HH:mm:ss` or null. Hours are 00
through 23, minutes and seconds 00 through 59. Reject 24:00:00, leap seconds, offsets,
fractional seconds, whitespace and missing seconds. These represent wall-clock values,
not instants. The host owns date/timezone interpretation and overnight business rules.

DATE-002: Values are nullable to represent clearing. Requiredness belongs to the
component/form contract and must not remove the empty state from its data type. Bounds
are optional canonical strings in the same domain. When both bounds exist, minimum must
not exceed maximum. Bounds and accepted values are inclusive. Validate factory bounds
before constructing a constrained schema, even for TypeScript callers.

RANGE-001: Date and time ranges are closed readonly DTOs with exactly `start` and `end`.
Both keys are required and each value is canonical or null. Either endpoint may be null
while editing, including `{start: null, end: value}`. Each present endpoint must satisfy
bounds. A complete range requires start <= end. Equal endpoints are valid. Time ranges
do not wrap midnight; a host needing overnight intervals uses an explicit domain model.

RANGE-002: Partial ranges are valid controlled editing state, not submitted complete
intervals. Future required range controls must require both endpoints for successful
native form submission. An incomplete field segment remains adapter draft data and must
not enter a range DTO until it is a complete canonical endpoint. A rejected host write
retains its previous committed state and does not dispatch a completion action.

## Locale and deterministic reference values

DATE-003: Locale is an explicit supported BCP 47 date-formatting locale. The named
default is `en-US`. Invalid, unsupported and excessively long locales are rejected. The
foundational locale schema checks Intl support; adapters force Gregorian calendar
display to preserve canonical dates even when a locale has another default calendar.

DATE-004: Calendar and InputDate must receive a required host `referenceDate`, a
canonical non-null date. It controls the empty focus month and placeholder reference.
InputTime uses a named explicit midnight placeholder reference. No layer reads the
ambient clock, timezone, browser locale or Date.now to choose initial markup. Future
SSR/hydration tests must vary server/client host timezone and verify identical markup
and behavior for the same explicit inputs. This foundation uses no Date constructor.

## Module boundary

DATE-005: Core owns only named policies and pure lexical/calendar predicates. Schema
owns strict validation, readonly DTOs and constrained schema factories. Neither layer
depends on rendering, browser globals, application state or vendor date libraries.
Per-component Props stay in Calendar/InputDate/InputTime modules when implemented.

Foundation exports from `schema/date-time/index.ts`:

- `isoDateSchema`, `dateValueSchema`, `dateLimitsSchema`, `DateLimits`.
- `isoTimeSchema`, `timeValueSchema`, `timeLimitsSchema`, `TimeLimits`.
- `boundedDateValueSchema(limits?)`, `dateRangeValueSchema(limits?)`.
- `boundedTimeValueSchema(limits?)`, `timeRangeValueSchema(limits?)`.
- `dateLocaleSchema`.

`limits` is the closed object `{min?: string, max?: string}` in the respective domain.
Value factories preserve string-or-null types. Range factories preserve readonly
start/end DTO types. Factories throw structured Zod issues for invalid limits rather
than silently weakening constraints. No registry kind is added by this batch.

## Proposed shared state registration

STATE-DATE-001: Propose `date`, `time`, `dateRange` and `timeRange` state kinds. Each
definition has the existing key/access fields and an initial value validated by the
unconstrained respective schema. Application controls register their bounded schema as a
shared constraint. Multiple controls sharing a key must intersect constraints, so a host
or generative write cannot bypass another control's limits.

STATE-DATE-002: A component binding is explicitly read or readWrite. Read mode renders
read-only editing while preserving navigation, selection and accessible text. Separate
app and SSR stores remain isolated. A owns review and shared registration; this batch
does not edit the state registry, recursive generative union or binding dispatch.

## Adapter dependency proposal

DATE-006: shadcn's current Base UI Calendar wraps DayPicker. DayPicker v10 prefers
`@daypicker/react`; `react-day-picker` remains a compatibility package. Recommend pinned
`@daypicker/react` 10.0.2 for Calendar. The preferred package currently depends on the
matching compatibility package internally. Adapt current v10 class names and slots, not
copied v9 mappings. SDK Date instances remain private to the trusted adapter.

DATE-007: Recommend pinned `react-aria-components` 1.22.1 for segmented InputDate and
InputTime, with direct `@internationalized/date` 3.12.4 for adapter parsing. React Aria
supports React 19 in its declared peer range. Use private SDK conversion, explicit
I18nProvider locale, explicit reference values and Gregorian calendar. No vendor object
may escape through public Props, callbacks, JSON or state. Installing dependencies and
browser acceptance requires a separate reviewed component batch.

Primary sources checked 2026-10-29:

- https://ui.shadcn.com/docs/components/base/calendar
- https://daypicker.dev/upgrading
- https://github.com/gpbl/react-day-picker/blob/main/packages/react/package.json
- https://react-aria.adobe.com/DateField
- https://react-aria.adobe.com/TimeField
- https://react-aria.adobe.com/internationalized/date/
- https://github.com/adobe/react-spectrum/tree/main/packages/react-aria-components
- https://github.com/adobe/react-spectrum/tree/main/packages/@internationalized/date

## Foundation acceptance

DATE-008: Cover leap-century boundaries, every month length, canonical lexical
rejection, minimum/maximum dates, null values, inclusive limits, invalid factories,
unknown fields, SDK/Date objects, partial and reversed ranges and locale failures.
Core/schema production files require 100% statements, branches, functions and lines. Use
no coverage exclusions, threshold reductions or test-check suppressions. Schema
acceptance does not prove any calendar or segmented-field rendering correctness.

DATE-009: Portable JSON Schema retains exact lexical length and regular-expression
constraints for dates and times. Independent AJV validation rejects missing padding,
timestamps, missing seconds and extra fields. Gregorian date validity and relational
range ordering remain explicit runtime semantic refinements; portable lexical shape is
not claimed to prove these rules. Test both capabilities and this boundary separately.

## Snapshot verification

2026-10-29: 56 focused tests in three files pass, including readonly DTO and primitive
type assertions. Full snapshot `npm run typecheck` passes all four project
configurations. Scoped type-aware lint passes. Every maintained foundation path meets
the 300-line, 88-column and two-space rules.

The unchanged global coverage run executes the 55 runtime cases and reports 100% in all
four categories for six nonempty owned production files: core policy/predicates, date,
time, locale and range schemas. Totals are 33 statements, 33 lines, 33 branches and 13
functions. The re-export barrel has zero executable totals. The focused coverage command
exits nonzero because unrelated production paths are unexercised; thresholds and
includes were not altered. Logs and reports are local snapshot cache artifacts:

- `.cache/date-time-before.log`: acceptance fails before production modules exist.
- `.cache/date-time-unit.log`: 56 passing cases including type contracts.
- `.cache/date-time-types.log`: full snapshot TypeScript 7 checks.
- `.cache/date-time-lint.log`: scoped type-aware lint.
- `.cache/date-time-coverage.log`: unchanged global coverage execution.
- `.cache/coverage-date-time/coverage-summary.json`: per-file numeric evidence.

No component, browser conformance, registry integration or vendor dependency
installation is claimed by this foundation batch.
