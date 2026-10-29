# Temporal FormField metadata correction

Status: scoped verification passed; combined project acceptance pending.
Source: fork-a only. Baseline: .cache/batches/pre-review-fix-source/manifest.json.
No public props, dependencies, state kinds, thresholds or native application markup
were added. Existing range reset/recovery and trusted form boundaries are retained.

## Confirmed problem and requirements

An actual production browser probe edited date 2026-10-14 to 2026-11-14 and time
12:30:00 to 13:30:00 through contenteditable segments inside disabled FormField.
Native FormData omission already worked. INPUT-DATE-012 and INPUT-TIME-011 now
require metadata adoption, matching FORM-FIELD-003/004. Six formal regression cases
failed before the correction; the red log is retained.

Entry adapters normalize inherited name/required defaults and disabled OR before
requests, SDK rendering, reset and native bridges. Controls associate scoped and
local descriptions, expose invalid state and avoid duplicate group feedback.
Explicit child names/required flags remain authoritative; disabled=false cannot
re-enable a disabled scope. Host writes remain permitted and controlled.

## Verification

- 87 tests, 27 files, including 14 new metadata/GenUI acceptance cases.
- Four changed executable files: 76 statements, 94 branches, 33 functions and
  74 lines, all covered at 100% per file. Existing temporal reset/recovery passes.
- Four production Chromium cases pass with one worker: both templates and
  single/range modes, disabled segment editing/focus, feedback and FormData.
- All four TypeScript projects, explicit owned typed lint, source policy, schema
  and example freshness, official build/bundle, packed consumer and strict MkDocs
  pass. Largest production chunk: 433367 bytes, unchanged budget.

The initial browser launcher used its config directory as cwd and did not start.
Two new GenUI assertions initially expected an exact description, while React Aria
correctly prepended its selected-value announcement. The assertions now require
the scoped feedback while preserving that SDK announcement. These were harness
corrections; their original logs remain available. No thresholds were changed.

Frozen delivery: .cache/batches/temporal-field-metadata/manifest.json with payloads,
baseline hashes, commands, evidence and source hashes. The original private browser
probe and screenshot are preserved. No final inventory verification is claimed.
