# Agent B InputDate delivery

Date: 2026-10-29. Source: `.cache/workspaces/fork-b`. Frozen batch:
`.cache/batches/input-date/files/` within that snapshot. Dependency: the reviewed
date-time-input-time-v2 foundation batch. Exact new paths:
`.cache/input-date-owned.json`. The freeze manifest separately lists the shared modified
policy and this integration ledger.

This batch delivers one catalog component, InputDate. It does not claim the remaining
Form/Data/Editor catalog or complete enterprise acceptance. Requirements live in
specs/components/input-date.md: INPUT-DATE-001 through INPUT-DATE-010.

## Public contract

Exports: InputDate and named InputDateProps from components/input-date/index.ts. Schema
exports: inputDateSchema and inputDateNodeSchema from schema/input-date/index.ts.
Adapter: ShadcnInputDate from adapter/shadcn/input-date/input-date.adapter.tsx. Binding:
BoundInputDate from state/generative-ui/bound-input-date.tsx. Conformance fixture:
INPUT_DATE_EXAMPLES from the matching **tests** module. Preview: InputDateExample from
docs/examples/input-date.tsx.

The controlled single value is YYYY-MM-DD or null. Explicit range mode uses readonly
nullable start/end endpoints with a matching callback. referenceDate is always required,
canonical and non-null. It controls placeholder editing independently of ambient time
and may lie outside the value bounds. Optional logical props are label description,
locale, inclusive min/max, name, required, disabled and readOnly. No SDK, styling,
native event or rendering override is public.

Private React Aria DateField uses memoized CalendarDate values and day precision. Locale
is explicit and its calendar extension is forced to Gregorian, preserving numeric locale
bidi. App controls outer layout independently. Native FormData stays canonical. Range
names are name.start/name.end. Shared private temporal helpers guard requests, validate
visible drafts and focus only the field's missing segment through its scoped ref. Both
spinbutton/textbox role variants are supported at that helper boundary.

Optional empty state is allowed; nonempty incomplete drafts and committed values hiding
missing segments cannot submit. Required ranges need both complete endpoints. Invalid
edits announce associated feedback. Standard React key identity explicitly resets an
unfinished draft without changing canonical state. The preview's Jotai reset revision
implements this for Restore; ordinary same-value updates continue preserving drafts.

## Shared integration proposals

The parent registered these additions in B's snapshot. Agent A deliberately merges them
into root rather than replacing shared files wholesale:

- Public component barrel, catalog Props import, entry and name.
- Shadcn field registry mapping with inputDateSchema and ShadcnInputDate.
- renderer/styles/input-date.css import.
- inputDateNodeSchema in the generative type-discriminated leaf union.
- BoundInputDate dispatch through the parent's additional node view.
- catalogBindings: boundedDateValueSchema for date state in single mode;
  dateRangeValueSchema for dateRange state in range mode, preserving reference access.
- INPUT_DATE_EXAMPLES in exhaustive conformance examples.
- InputDateExample in Fields and its reference page in MkDocs navigation.
- Central generated transport schemas and compiled example refresh.

The existing date/dateRange state kinds and registry infrastructure belong to the
parent's temporal foundation integration. No new state kind or dependency is added. The
existing pinned react-aria-components and @internationalized/date packages are consumed
through official public DateField and I18nProvider subpaths.

One existing production path is modified: src/core/date-time-policy.ts gains the named
completeDraftValue marker consumed by the new generic temporal native-validity helper.
Merge that addition into the latest shared policy. Immutable InputTime-v2 source files
are not changed by this Date batch; the parent's Time role follow-up is separate.

## Verification evidence

52 tests pass across twelve files. All thirteen nonempty owned/modified production files
have 100% statement, branch, function and line coverage: 115 statements, 108 lines, 100
branches and 42 functions. Global include lists and thresholds remain unchanged. The
focused coverage command exits nonzero for unrelated unexercised paths; owned
percentages were independently inspected. Evidence: .cache/input-date-coverage.log and
.cache/coverage-input-date/coverage-summary.json.

Full four-project TypeScript 7 check passes: .cache/input-date-final-types.log.
No-ignore type-aware lint reports zero diagnostics across 28 files:
.cache/input-date-final-lint.json. All maintained owned files pass line, width and
indentation policy. No any, unsafe cast, non-null assertion or suppression is used.

The parent's production build passes and all ten InputDate Chromium cases pass:
.cache/b-updated-build.log and .cache/b-updated-browser.log. That broader invocation
contains unrelated Chat failures and is not reported as globally passing. Date cases
cover both profiles, four widths, 200% text, actual direction/bidi, target geometry,
keyboard leap-date edits, range/partial validity and focus, Arabic edits, protection and
page errors. No Safari/iOS rendering claim is made from Chromium/helper tests.

SSR/hydration varies ambient timezone/clock, including Samoa's skipped date, while
preserving the explicit Gregorian value. Earliest year and future host reference entry
are covered. Transport covers isolated stores, readonly mirrors and host constraints.

The same-canonical-value Restore failure is retained in input-date-restore-before.log;
the corrected identity reset passes input-date-restore-after.log. Other pre-code
acceptance failures are input-date-before.log, input-date-adapter-before.log and
input-date-example-before.log under the snapshot cache.

Root schema freshness, packaging, MkDocs and complete combined gates remain separate
acceptance. No commit, push, publication, deployment or DNS change was performed.
