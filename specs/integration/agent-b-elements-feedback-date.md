# Agent B delivery 03: elements, feedback and InputDate

Status: frozen and verified in B's isolated checkpoint. Root acceptance is separate.
Baseline: delivery02 controls-transcript/checkpoint. No root production files changed.

## Included contracts

- Element: Icon plus compatible Alert, Badge, Button, Card and Progress extensions.
- Chat: ChatReasoning, ChatTool and ChatShimmer.
- Form: InputDate single/range on the accepted canonical temporal foundation.
- Callback correction: Button, Alert, six transcript/feedback components, Toggle and
  Select pass only declared logical arguments. User has its separate minimal delta.

Requirements are owned by specs/components/element-foundations.md, chat-feedback.md,
input-date.md, chat-event-boundary.md and form-callback-boundary.md. Existing callers
remain valid. Public Props are inferred in each component module. No new dependency
is added beyond delivery02's accepted temporal package proposal.

## Behavior

Icon uses a closed semantic vocabulary and explicit decorative/labelled intent.
Button loading and icons retain protected actions. Card supports safe header/footer
slots. Progress accepts indeterminate null, custom maximum and accessible value text.
Alert supports controlled visibility and registered actions.

Reasoning and Tool use controlled disclosures, scoped Escape and guarded approval
capabilities. Shimmer keeps text contrast constant and animates only a finite decorative
underline; reduced motion disables it. Tool readers cannot approve or reject.

InputDate uses canonical Gregorian values, explicit reference dates and private SDK
conversion. Partial native drafts cannot submit stale canonical values. Readonly values
remain in FormData; disabled values are omitted. Restoring preview state also restores
the draft, without weakening ordinary host-rejection behavior.

## Shared integration proposals

Merge modified aggregate files deliberately. Never replace A's catalog, state kinds,
direction providers or modal/navigation corrections wholesale.

- Add the five new public modules and their exhaustive shadcn entries/fixtures.
- Merge compatible per-component schemas and generated schema output.
- Merge recursive Card header/footer slots, leaf schemas, bindings and action dispatch.
- Add AdditionalNodeView delegation to keep maintained modules below 300 lines.
- Merge nullable Progress binding limits and Element action properties.
- Merge owned CSS imports, template variables, demo mounts and MkDocs references.

The source snapshot has 76 public component modules. This batch covers ten assigned B
inventory entries, including six extensions to existing modules. Only A may mark root
inventory entries Verified after integrated acceptance.

## Verification

Frozen checkpoint: .cache/batches/element-feedback-date/checkpoint.

- 1211 tests passed in 352 files using one Vitest thread worker.
- 612 executable files have 100% statements, branches, functions and lines per file.
- Totals: 3793 statements, 2792 branches, 1141 functions and 3507 lines.
- Policy, all strict TS7 projects, explicit no-ignore typed lint, schema/example
  freshness, package build/check and strict MkDocs passed.
- Chromium covered 339 scenarios: 335 passed in the initial complete run. Four cases
  encountered ENOSPC while writing browser artifacts, then all four passed unchanged
  with --last-failed and two workers. No assertion, timeout or threshold was weakened.

Earlier fork-worker runs encountered transient legacy Popover timeouts. The unchanged
suite passed with --pool=threads --maxWorkers=1 at the original five-second timeout.
Logs retain those failures. Build initially found a snapshot manifest omission of the
unchanged delivery02 input-time.css; restoring that exact baseline asset fixed it.

Evidence is copied under this batch's evidence directory. stage-results.json retains
the initial browser resource error and successful targeted retry separately.

## UI delivery gate

R-03 PASS: Chromium checked narrow layouts, long content, 200% text and RTL.
R-25 PASS: validated template palettes and the feedback contrast fixture passed.
R-26/R-32 PASS: actions, focus, disclosures and protected readers were exercised.
R-35 PASS: production build, package checks and live browser scenarios passed as above.
R-39 PASS: owned controls retain visible labels, focus and reduced-motion behavior.
Purpose PASS: inherited typography, spacing and palette preserve both design profiles;
finite feedback motion communicates pending work without changing text contrast.
Liveliness PASS: technical catalog direction remains ENERGY 1 / RHYTHM 2 / MOTION 1.
Craftsmanship PASS: scoped SSR/hydration and actual interaction evidence accompany the
closed contracts. Schema validation is never treated as browser proof.

## Applying the delivery

Use new-paths.txt, modified-paths.txt and changes.json with hashes. Component-owned
changes are safe for review independently; aggregate.patch is a proposal against the
delivery02 checkpoint. Later Form/Data/Locale/ColorMode/Editor work is not included.
Apply the minimal Button/User callback correction before this batch; the Button
foundation retains that correction and this delta does not overwrite User.

All work remains local. No commit, push, publication, deployment or DNS change occurred.
