# Agent B delivery 02: temporal controls, FieldGroup and transcript

Date: 2026-10-29. Status: immutable snapshot passes all required local check stages.
Root acceptance remains Agent A owned. This batch adds six catalog entries to delivery
01: Calendar, InputTime, FieldGroup, ChatAttachment, ChatMessage and ChatMessages.

## Sources and evidence

Batch: `.cache/workspaces/fork-b/.cache/batches/controls-transcript/`.

- `files/` contains exact changes relative to delivery 01.
- `new-paths.txt`, `modified-paths.txt` and `changes.json` separate path ownership.
- `aggregate.patch` provides reviewable additions against delivery 01.
- `checkpoint/` contains the complete frozen 71-component source.
- `evidence/` retains logs, stage results and per-file coverage summary.

The live B workspace has later Element, feedback and InputDate work. Do not import it
wholesale. Those later modules are outside this verified checkpoint.

## Integration

Merge component-owned paths, then review shared changes. Do not replace A's aggregate
files, browser ports, package manifest, lockfile, generative visitors or state registry.
Regenerate schemas after the combined merge. Public named Props and component exports
are listed in the component-owned integration notes supplied with this batch:

- `agent-b-calendar.md` for Calendar, date/dateRange readers and writers.
- `agent-b-dates.md` for InputTime, time/timeRange and the pure temporal foundation.
- `agent-b-chat.md` for transcript views and explicit registered actions.

FieldGroup exports `FieldGroup` and `FieldGroupProps`; schema/field-group exports
`fieldGroupSchema`, recursive `fieldGroupNodeSchema` and `FieldGroupNode`. Its shadcn
entry groups safe content without rewriting child props. The normal recursive visitor
validates nested actions and bindings. It adds no state kind.

Shared registrations add date, time, dateRange and timeRange to the existing registry.
Each has a separate schema module. ISO date/time scalars remain nullable; range DTOs
permit partial endpoints but reject reversed complete values. Mounted control bounds
constrain all registry writes. Both binding modes and isolated stores remain supported.

Dependency additions, pinned only in B's independent installation:

- `@daypicker/react`: 10.0.2.
- `react-aria-components`: 1.22.1.
- `@internationalized/date`: 3.12.4.

Use the official narrow React Aria public exports. Its broad barrel pulls unrelated
declarations incompatible with exact optional properties. No suppression, declaration
patch or skipLibCheck change is included.

## Review corrections retained

InputTime uses a fixed private UTC anchor while public values remain HH:mm:ss. SDK
objects are memoized so rejected edits retain their draft. Partial drafts cannot submit
an old canonical value, and required range submission validates both endpoints. Native
FormData contains canonical strings, never the private anchored SDK representation.

Missing-segment focus and touch targets support both spinbutton and textbox roles.
The latter has a captured failing and passing helper regression. This is role
compatibility evidence, not an actual Safari conformance claim.

Independent AJV schemas retain ISO lexical length/pattern constraints. Gregorian date
semantics still use runtime validation; a well-shaped February 30 is not accepted by
the runtime merely because its portable JSON shape passes.

The transcript hook result is destructured before passing event handlers. The complete
typed lint run caught an interprocedural ref-access diagnostic missed by a narrower
run. The corrected complete lint stage passes without suppression.

## Verified checkpoint

All stages passed: source policy, strict four-project types, typed lint over explicit
maintained paths, schema freshness, example freshness, coverage, build, packed consumer,
Chromium and strict MkDocs. Explicit lint paths avoid the ancestor .cache ignore rule;
no runtime include, exclusion or threshold was changed.

- 1063 tests passed in 284 files.
- 547 executable files measured 100% in all four categories.
- Statements: 3392 / 3392; branches: 2410 / 2410.
- Functions: 1002 / 1002; lines: 3131 / 3131.
- 306 Chromium scenarios passed, including the prior baseline and new controls.

Coverage exposed a missing Calendar range transport scenario; the added test traverses
the public generative dispatcher, commits a selected range and rejects out-of-bound
host writes and mismatched state kinds. No coverage path was hidden.

The first frozen build detected an omitted FieldGroup CSS path. The manifest was
corrected, source policy rerun, and build/package/browser/docs then passed. Earlier
failures and subsequent passing stages remain in the evidence log.

This is a six-entry delivery, not completion of B's 50 entries or the enterprise goal.
No root production edits, commits, pushes, publication or deployment were performed.
