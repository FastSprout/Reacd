# Calendar

Status: specification before implementation. Root integration and browser acceptance
remain separate gates.

CAL-001: Calendar is a closed TSX component with its own inferred named Props type.
Require accessible label, canonical non-null referenceDate, controlled value and typed
onValueChange. Optional/default single mode accepts canonical date strings or null.
Explicit range mode accepts readonly start/end DTOs with nullable endpoints. Validate
every public value through the shared date foundation. No SDK Date object, HTML, styling
prop, slot renderer or native event is part of the public API.

CAL-002: Optional min/max are inclusive ordered canonical dates. Existing selected
endpoints must satisfy limits. The reference date may lie outside limits; clamp the
initial view into the navigable interval. Bound numberOfMonths to one or two, default
one. weekStartsOn is an integer zero through six, default Monday. Locale is an explicit
supported Intl locale, default en-US; formatting forces Gregorian calendar and UTC.

CAL-003: The host reference date determines the empty focus month and today marker.
Selected single/start/end dates determine the initial view before the reference date. Do
not use the ambient clock, host timezone or browser locale. Native Date instances remain
inside the trusted adapter. Convert dates through UTC full-year setters so years 0001
through 0099 retain their identity. Equal input must produce equivalent SSR markup
across host timezones and hydrate without date drift.

CAL-004: Compose DayPicker v10 with trusted shadcn Button day controls. Navigation,
Arrow keys, PageUp/PageDown, Home/End and Enter/Space follow the DayPicker grid pattern.
App direction supplies logical RTL keyboard navigation. Disabled blocks navigation and
selection. ReadOnly preserves navigation/focus but never requests selection changes.
Single selection toggles to null unless required. Range clicks start, extend, reverse or
restart using ordered endpoints. Partial ranges remain valid controlled edits.

CAL-005: Description is associated with the named calendar region. Required calendars
participate in native form validation through a positioned bridge. Required single
selection needs a value; required range needs both endpoints. Failed validity focuses
the visible calendar. Optional logical name serializes a single canonical date or
separate name.start/name.end range values. Disabled bridges do not submit values.
ReadOnly prevents selection changes, not required validation. Required read-only null
or partial values, including generative read bindings, block form submission and focus
the visible calendar. Complete read-only values validate and serialize normally.

CAL-006: Calendar columns preserve minimum 44px day touch targets. A labelled local
viewport scrolls horizontally when seven columns cannot fit; it never creates page
overflow. Two months reflow when space is insufficient. Labels wrap, selected day text
uses the template onPrimary token, and focus remains visible in both templates. All
physical directional effects use provider-derived attributes rather than :dir.

CAL-007: Generative transport uses date or dateRange references according to mode. The
reference grants read or readWrite access explicitly. Read bindings force readOnly. Each
control contributes a bounded date/range constraint so shared writes cannot bypass
another control's limits. State registration is a coordinated integration task.

CAL-008: Acceptance covers strict schemas and type failures, callbacks and host
rejection, single clearing, partial/complete range selection, limits, disabled/readonly,
native FormData/required focus, dates below year 0100, localization, actual RTL,
SSR/hydration and narrow/200%-text browser geometry. Every owned runtime file requires
100% statement, branch, function and line coverage. Schema validation is not browser
rendering evidence.

Primary references retrieved 2026-10-29:

- https://ui.nuxt.com/docs/components/calendar
- https://ui.shadcn.com/docs/components/base/calendar
- https://daypicker.dev/upgrading
- Installed @daypicker/react 10.0.2 public declarations and implementation.

The curated React contract supports single/range selection, bounded dates, weekday
start, one/two visible months, locale, native forms and controlled updates. Upstream
multiple-date selection, arbitrary slots, external SDK objects and visual styling
escapes are outside this contract; their parity is not claimed.
