# Calendar read-only required validation correction

Status: isolated correction verified on 2026-10-29. Combined integration remains
the parent agent's acceptance gate. No public API change.

## Baseline and ownership

Source baseline: B delivery 02 immutable `controls-transcript/checkpoint/`.
Working copy: `.cache/workspaces/b-calendar-validation/`.
Dependencies are a read-only symlink to B's independent installation. Nothing
was installed through that link. No live B, fork A or root source was edited.

Modified owned paths:

- `src/adapter/shadcn/calendar/calendar-form-bridge.tsx`
- `specs/components/calendar.md`

New owned paths:

- `src/adapter/shadcn/calendar/readonly-required.test.tsx`
- `demo/e2e/calendar-readonly-required.spec.ts`
- `specs/integration/calendar-readonly-validation.md`

Only the bridge's native required validator changes: `readOnly` no longer
disables it. Disabled controls remain exempt and omitted from FormData.
Selection remains read-only. Generative read references inherit the correction.
CAL-005 now explicitly states this existing required-selection guarantee.

## Acceptance and evidence

Tests were added before the source change. The initial run captured five
failures: null single selection, start-only and end-only ranges, and generative
read bindings for both date and dateRange. Five complete/disabled cases passed.

After the correction, 16 tests across the regression and existing Calendar
adapter suites pass. The changed runtime file has 100% statement, branch,
function and line coverage: 5 statements, 18 branches, 2 functions and 5 lines.
No runtime exclusion or threshold was changed. Coverage was scoped explicitly
to the one changed runtime file; it is not a combined-project coverage claim.

Four-project strict type checking, explicit typed lint for all three changed
TypeScript files and source policy pass. Local worker/cache configuration was
wrapped to retain the 88-column policy; these harness-only changes are not
part of the delivery. Source files retain the 300-line and two-space limits.

Four native Chromium scenarios pass using the existing runnable Calendar TSX
example on isolated port 5196, one worker, both Spacious and Compact templates.
They confirm blocked native submit and visible Calendar focus for a null
read-only value and partial read-only range, successful canonical complete-range
submission, and disabled omission. Generative read bindings are verified in the
colocated runtime regression; no generative Form transport is introduced.

Preserved logs and summaries are in the frozen batch's `evidence/` directory.
The initial expected red run is retained separately from passing checks.
No build, package or whole-project suite was repeated for this private bridge
condition; combined acceptance belongs to the parent integration workspace.

## Handoff

Frozen batch: `.cache/batches/calendar-readonly-validation/` in this workspace.
Its manifest records exact payload hashes and baseline hashes for modified
paths. The aggregate patch applies to immutable B delivery 02, not arbitrary
later live work. Merge the two modified paths by intent if they have moved.
Import the three new paths verbatim, then run combined acceptance gates.
No commit, push, publication, deployment or DNS change was performed.
