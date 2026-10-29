# Agent B date foundation and InputTime delivery

Date: 2026-10-29. Source snapshot: `.cache/workspaces/fork-b`. Frozen batch:
`.cache/batches/date-time-input-time-v2/files/` in that snapshot. Exact owned path
manifest: `.cache/date-time-input-time-owned.json`.

This batch delivers one public catalog component, InputTime, plus reusable date/time
core/schema foundations. It does not claim Calendar, InputDate or the complete B scope.
The parent integrated temporary snapshot aggregates for independent checks. Agent A must
deliberately merge those changes into root and run the combined root gates.

## Contracts and exports

Requirements: DATE-001 through DATE-009, TIME-001, RANGE-001/002, STATE-DATE-001/002 and
INPUT-TIME-001 through INPUT-TIME-009.

Primary authoring: `InputTime`, `InputTimeProps` from components/input-time/index.ts.
Single mode is optional/default and uses canonical string-or-null values. Explicit range
mode uses a readonly start/end DTO with nullable endpoints. Both require matching typed
callbacks. Labels, descriptions, locale, min/max, name and protection are logical props.
No SDK value, native event or styling prop is public.

Foundation schema exports are documented in specs/components/date-time.md. Date and time
boundaries use canonical padding, semantic calendar validation, inclusive ordered limits
and independently nullable range endpoints. Partial ranges are editing state; required
range submission needs both values. Complete reversed ranges are rejected. Portable JSON
Schema retains lexical length/pattern checks. Gregorian calendar validity and relational
ordering remain runtime refinements and are not claimed as AJV proof.

InputTime schemas: `inputTimeSchema` and `inputTimeNodeSchema` from schema/input-time.
The TSX schema is a strict mode union. The transport schema is a single strict object
with optional enum mode so the central type-discriminated generative union can consume
it. Both transport modes use the same explicit read/readWrite binding shape.

Adapter: `ShadcnInputTime` from adapter/shadcn/input-time/input-time.adapter.tsx. It
composes private segmented React Aria controls with shadcn Button/theme tokens. Named
policy fixes 24-hour second precision and explicit midnight placeholder. A fixed private
UTC anchor avoids ambient date/timezone choices without changing the public wall-clock
meaning. Private anchored SDK values never enter FormData; a canonical hidden bridge
serializes name or name.start/name.end. Native React Aria validation inputs stay unnamed
and still enforce required submission/focus.

A separate private native projection observes render-prop segment completeness. It
blocks optional nonempty partial drafts and old committed values masking missing
segments. Empty optional state is allowed; a declined clear must either restore the
visible committed value or remain blocked. Focus uses only the DateInput's scoped ref.
SDK values and bounds are memoized so feedback rerenders preserve an editable draft.

Binding: `BoundInputTime({node, registry})` from
state/generative-ui/bound-input-time.tsx. Single mode requires time-kind state; range
mode requires timeRange. Read mode forces readOnly, and constraints protect host writes.
The helper returns Issues for failed binding resolution. Generative transport/SSR tests
cover independent client/server stores, shared readonly mirrors and rejected host
updates.

## Shared integration proposals

Do not copy aggregate files from a stale worker. The parent applied these additions in
the current B snapshot, but Agent A owns their root merge:

- Add InputTime public export, Props import, catalog entry and name.
- Add InputTime renderEntry mapping to the shadcn field registry.
- Import renderer/styles/input-time.css.
- Add inputTimeNodeSchema to generative leaf schemas.
- Add InputTime constraints to catalogBindings: boundedTimeValueSchema for single;
  timeRangeValueSchema for range, with each reference's explicit access mode.
- Add BoundInputTime dispatch to the central node view.
- Merge INPUT_TIME_EXAMPLES into exhaustive shadcn conformance fixtures.
- Mount InputTimeExample in Fields and add its public reference to MkDocs navigation.
- Regenerate transport schemas and compiled examples centrally.

The parent separately owns added state schemas/kinds and registry createEntry handling
for date, time, dateRange and timeRange. Those six foundation state files and their
aggregate edits are not part of this owned delivery. Their validators consume the
unconstrained canonical foundation schemas; component constraints intersect separately.

Dependencies installed by the parent in B's independent node_modules: exact
react-aria-components 1.22.1 and @internationalized/date 3.12.4. Parent-owned package
and lock changes accompany the combined batch. Official public TimeField and
I18nProvider subpaths avoid unrelated strict-type defects pulled by the package's main
index. No dependency patch, unsafe cast, any, non-null assertion or suppression is
required.

## Verification

Combined owned run: 106 tests pass in sixteen files. All nineteen nonempty production
files are 100% in all four categories: 141 statements, 135 lines, 133 branches and 54
functions. The global include list and per-file thresholds remain unchanged. Focused
coverage exits nonzero for unrelated unexercised modules; owned file percentages were
checked individually. Reports: .cache/coverage-input-time-final/coverage-summary.json
and .cache/input-time-final-coverage.log.

Full snapshot four-project TypeScript 7 check passes: .cache/input-time-final-types.log.
Scoped --no-ignore type-aware lint reports zero diagnostics across 40 source/test files:
.cache/input-time-final-lint.json. Maintained files meet the line/column/indentation
rules.

Parent production build and Chromium run: .cache/b-controls-browser.log, thirty total
cases, including ten InputTime cases. Two profiles, four widths, 200% text, actual
App/locale directions, keyboard changes, range validity/focus, protected actions and
page errors are exercised. Scoped SSR/hydration covers changed ambient clock/timezone
and a DST-gap local time. Parent aggregate/package/MkDocs checks remain separate gates.
The parent's corrected production build and ten-case browser rerun also pass the added
committed-partial submission assertion: .cache/b-time-fixed-build.log and
.cache/b-time-fixed-browser.log. Eight focused tests separately prove the draft
validation fix with unchanged full owned coverage.

Negative evidence is retained locally: date-time-before.log, input-time-before.log,
input-time-adapter-before.log, input-time-example-before.log and
date-time-portable-before.log under .cache/. These distinguish unimplemented contracts
and missing portable lexical constraints from subsequent passing verification. The
confirmed partial-submission failure is time-partial-validation-before.log.

## Exact new owned paths

The frozen batch includes the forty-four paths in date-time-input-time-owned.json plus
this integration ledger. No pre-existing production file is overwritten by the owned
delivery. Shared aggregate/package changes are the parent's separate proposal.

No commit, push, publication, deployment or DNS change was performed.
