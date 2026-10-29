# Controlled temporal recovery correction

Date: 2026-10-29. Isolated correction against immutable B03 checkpoint
element-feedback-date. No B, fork-a or root live source was edited. Public TSX,
generative schemas, dependencies, aggregates and application state kinds are
unchanged. Root combined acceptance and final independent reviews remain gates.

## Acceptance and resulting behavior

Four acceptance tests failed before implementation: Date and Time each emitted
a mixed range on native reset and retained invalidity after valid host updates.
InputTime had the same independently reproduced defects as InputDate. Calendar
does not use either changed request hook and was not modified.

Native range reset now suppresses the SDK's separate endpoint reset requests and
requests one frozen complete initial DTO per uncanceled native reset event. It
validates against current committed bounds and protection. Readonly/disabled or
host-declined resets retain authoritative controlled values and form data. It
does not prevent native reset of unrelated controls. Reset listeners are scoped
to the nearest actual native form and released on unmount. Distinct reset events
retain separate logical requests, including consecutive synchronous resets.

Private draft identities reconcile after explicit native reset. A reset that
recreates a focused segment restores its corresponding segment without scrolling
or replacing focus placed on another connected control by the host. Ordinary
same-value rerenders never recreate the controls or discard unfinished drafts.
A focused-reset regression was added and failed before that private repair.

Rejected-edit feedback records a semantic canonical value/limit basis. It expires
when a valid controlled replacement or limit change supersedes that basis.
Object identity and endpoint property order do not constitute a change. Recovery
does not commit the previously rejected candidate or call the host callback.
InputTime's private wrapper delegates to this same tested request boundary.

## Exact executable scope

Four modified modules:

- src/adapter/shadcn/input-date/input-date.adapter.tsx
- src/adapter/shadcn/input-time/input-time.adapter.tsx
- src/adapter/shadcn/input-time/use-time-change.ts
- src/adapter/shadcn/temporal/use-temporal-change.ts

Three new private modules:

- src/adapter/shadcn/temporal/temporal-recovery.ts
- src/adapter/shadcn/temporal/use-range-reset.ts
- src/adapter/shadcn/temporal/range-reset-focus.ts

Requirements extend INPUT-DATE-011 and INPUT-TIME-010 in their owning specs.
Tests remain colocated. Native browser cases stay in demo/e2e. A dedicated
test-support fixture builds production assets and serves only on port 5201.
Its native forms and HTML are trusted test harnesses, not application APIs.

## Verification

Final affected gate: 138 tests in 30 files pass with the original five-second
timeout, one thread worker and a unique module cache. It includes Date/Time
adapter/form/hydration tests, shared helpers, schemas, state bindings, temporal
registry constraints and runnable documentation examples.

All seven changed/new executable modules have 100% statements, branches,
functions and lines per file: 89 statements, 52 branches, 31 functions, 82 lines.
No threshold, runtime exclusion or coverage suppression was introduced.

Four strict TS7 projects, explicit no-ignore typed lint and production package/
demo build pass. Maintained changed files satisfy 300 lines, 88 columns and
two-space indentation. Final policy passes. Twelve production Chromium cases
pass on port 5201; the fixture's preview server exits after the suite.

Browser acceptance covers Date and Time in both existing templates, atomic
native reset, FormData, unrelated fields, host refusal, readonly/disabled,
external recovery, same-value incomplete drafts, meaningful missing-segment
focus and focused programmatic reset. These are Chromium checks, not Safari
claims. SSR/hydration cases verify independent native form ownership and IDs.

The first broader final attempt hit severe machine contention: unchanged
Calendar and documentation examples timed out; even five small hook tests took
80 seconds. Only the reviewer's process was stopped. Resource-failure logs are
retained. The sequential affected gate then passed at unchanged limits. The
unchanged Calendar folder then passed separately: ten tests in three files.

## Applying the overlay

Use .cache/batches/temporal-recovery/manifest.json, files/, diffs/ and evidence/.
Each modified path includes its exact B03 baseline hash. Apply after B03 rather
than replacing aggregates from that older checkpoint. All affected live B paths
matched their immutable baselines during review and before freezing.

No package or lockfile change is needed. The dependency link targets the reviewed
fork-a-b02 installation; the three temporal dependency versions match B03.
Never install through that link. No root inventory entry is marked Verified.

Tool-produced build output, dependency links, coverage JSON, logs, manifest JSON
and diffs retain required formats and are outside maintained source limits.
The existing test-support coverage exclusion applies only to the harness.
All actual production changes are included explicitly in the coverage gate.
No commit, push, publication, deployment or DNS operation is authorized.
