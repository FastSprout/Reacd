# Agent B Calendar delivery

Status: component-owned implementation and focused acceptance complete in fork-b. Root
integration and complete combined acceptance remain Agent A owned.

## Contract and integration

Requirements: CAL-001 through CAL-008 in specs/components/calendar.md, together with the
date/time foundation DATE/RANGE/STATE-DATE contracts.

Public exports: Calendar and CalendarProps from components/calendar/index.ts. Schema
exports: calendarSchema, calendarSettingsSchema, calendarNodeSchema and
CalendarNodeDeclaration from schema/calendar/index.ts.

Add Calendar to ComponentCatalog, COMPONENT_NAMES and public exports. Spread
calendarEntries from adapter/shadcn/registry/calendar.ts into the shadcn adapter. Import
renderer/styles/calendar.css and spread calendarVariables() into the template variable
mapper. Spread CALENDAR_EXAMPLES into adapter conformance examples. Mount
CalendarExample in Fields and add docs/components/calendar.md to MkDocs navigation.

Transport has one strict Calendar object with optional single/range mode and a value
state reference. It intentionally avoids a nested mode union inside the central type
discriminated union. Public TSX props retain the single/range discriminated union.
Central bindings register bounded date/dateRange constraints by mode. GenerativeNodeView
delegates Calendar to BoundCalendar({node, registry}). Shared state kind registration
and aggregate changes were coordinated with the parent; this worker edited no existing
aggregate files.

Dependency: pinned @daypicker/react 10.0.2, installed by the parent in B's independent
dependency installation. Native Date values stay in the trusted adapter. Explicit UTC
and Gregorian Intl formatting preserve host reference dates, including years below100.
The controlled range transition is owned pure core behavior and permits equal endpoints.

## New owned paths

```text
demo/e2e/calendar.spec.ts
docs/components/calendar.md
docs/examples/calendar.test.tsx
docs/examples/calendar.tsx
specs/components/calendar.md
src/adapter/shadcn/__tests__/calendar-examples.tsx
src/adapter/shadcn/calendar/calendar-date.test.ts
src/adapter/shadcn/calendar/calendar-date.ts
src/adapter/shadcn/calendar/calendar-day-button.tsx
src/adapter/shadcn/calendar/calendar-form-bridge.tsx
src/adapter/shadcn/calendar/calendar-hydration.test.tsx
src/adapter/shadcn/calendar/calendar-localization.ts
src/adapter/shadcn/calendar/calendar.adapter.test.tsx
src/adapter/shadcn/calendar/calendar.adapter.tsx
src/adapter/shadcn/registry/calendar.ts
src/components/calendar/calendar.props.ts
src/components/calendar/calendar.tsx
src/components/calendar/calendar.types.test.ts
src/components/calendar/index.ts
src/core/calendar-policy.ts
src/core/calendar-range.test.ts
src/core/calendar-range.ts
src/renderer/styles/calendar.css
src/renderer/theme/calendar-variables.ts
src/schema/calendar/calendar.schema.ts
src/schema/calendar/calendar.test.ts
src/schema/calendar/generative.schema.ts
src/schema/calendar/index.ts
src/state/generative-ui/bound-calendar-range.tsx
src/state/generative-ui/bound-calendar-single.tsx
src/state/generative-ui/bound-calendar.test.tsx
src/state/generative-ui/bound-calendar.tsx
```

The machine-readable list is .cache/calendar-owned.json. This integration note is an
additional internal metadata path; it is never public documentation.

## Verification evidence

2026-10-29:

- .cache/calendar-before.log captures failing acceptance before modules existed.
- .cache/calendar-unit-final.log: 24 passing tests across eight files, including strict
  props/type failures, single/range callbacks, required partial ranges, disabled
  FormData omission, bounds, readonly access, actual App RTL arrows, localized month
  labels, early-year UTC SSR, hydration and server/client state isolation.
- .cache/calendar-coverage/coverage-summary.json: all sixteen nonempty owned runtime
  files have 100% statements, branches, functions and lines. Totals: 113 statements, 121
  branches, 36 functions and 105 lines. Three Props/barrel paths have no executable
  totals. The unchanged global coverage command also reports unrelated unexercised
  modules, so its exit status is not claimed as a full project pass.
- .cache/calendar-lint.log: explicit no-ignore type-aware owned-file lint passes.
- Source checks pass for all owned paths: maximum300 lines, maximum88 columns, two-space
  indentation and no tabs.
- Parent production build and .cache/b-controls-browser.log: all thirty scenarios pass
  across Calendar, InputTime and FieldGroup. Calendar contributes ten Chromium
  scenarios: Spacious/Compact at240/360/768/1440px with two months, 200% text, scoped
  RTL arrow movement,44px targets, local scrolling, no page overflow and selected
  foreground. Two interaction scenarios exercise required focus, single selection, range
  completion and readonly/disabled protection without page errors.

Focused type runs reached unrelated in-progress shared JSX/FieldGroup failures; final
combined types and all other project gates remain the integrator's responsibility. No
browser claim is inferred from schema validation. No root Verified status changed.

## Reference snapshot

Nuxt Calendar reference cached at .cache/references/calendar-nuxt.md. SHA-256:
`d465b5abbc83d090bab4c68db994a99adc2ab6ed4a7288f377cbf4f932740b15`. The curated contract
and explicit unsupported upstream escape hatches are documented in the component
specification and public reference page.
