# Listbox FormField metadata overlay

Date: 2026-10-29. Status: isolated verified followup; combined acceptance and the
final independent Standards/Spec reviews remain pending. No inventory state is
changed. The original .cache/batches/listbox delivery remains immutable.

## Baseline and dependency

This overlay applies after the frozen Listbox batch. Exact previous hashes come
from .cache/listbox-metadata-baseline.json. B's frozen form-controls dependency
src/renderer/form-field/field-metadata.ts was imported byte-for-byte, hash checked
against its manifest, and remains unchanged. Its SHA-256 is:
b766fdea3cff9d212764a2ea1d9aca91181347a2eeadd3164f0e4e8282f58078.
The manifest records this dependency separately; it is not an owned payload file.
Parent integration must retain that same shared context identity.

## Behavior and acceptance

LISTBOX-013/014 preceded five colocated acceptance cases. Four failed against the
frozen adapter: missing inherited feedback/error state, a disabled parent still
emitting a selection request despite child disabled=false, and empty readonly
selection bypassing inherited required validation. Explicit required=false was
already correctly accepted as an override. The original red log is retained.

The adapter now resolves metadata before its request model and native form
bridge. Explicit name overrides inherited name. Required inherits by default;
explicit required remains authoritative. Disabled combines with OR and cannot be
reenabled by a child. Outer descriptions/errors join local feedback IDs without
duplicates, and outer error marks the visible list invalid. FormField continues
to own its controlled error text. There are no new public props, schema changes,
state kinds, dependencies, styling changes or B-owned source modifications.

## Verification

Final owned scope: 65 tests in 17 files pass. Fifteen executable modules remain
100% covered in statements, branches, functions and lines: 208 statements,
177 branches, 61 functions and 176 lines. Three type/barrel files are empty.
The sole changed executable production file is listbox.adapter.tsx.

Production noEmit, all four strict TS7 projects, explicit no-ignore typed lint,
source policy, official declaration/package/demo build and packed consumer,
negative fixtures, SSR/state/exports checks pass. No coverage/runtime exclusion,
budget, timeout or threshold was changed. Public docs/schema bytes are unchanged.
Their previous full baseline freshness/MkDocs acceptance remains applicable.

Twelve production Chromium demo scenarios pass again with one worker: both
profiles, four widths, 200% text, RTL, native keyboard, veto, Clear focus, required
forms, readonly, FormData and browser-constructed IME flags. The latter is not an
OS IME session or Safari evidence.

Two additional production-bundled native metadata scenarios pass: inherited
name/feedback, dynamic disabled OR despite explicit child false, suppressed native
pointer/keyboard writes, disabled serialization, exact logical callback args,
readonly required rejection, meaningful list/option focus and explicit required
false submission. The trusted native acceptance harness is verification-only;
maintained conformance lives in demo/e2e/listbox-field-metadata.spec.ts.

The first harness setup listened on localhost while readiness used 127.0.0.1.
Only its identified preview PID was stopped and the test-only host corrected.
A subsequent assertion demanded root focus even though the official SDK moved
focus into a meaningful option. It was corrected to check scoped list focus,
matching LISTBOX-008 and the existing production demo assertion. These failed
attempts remain labelled evidence; they did not trigger production changes.

## Scope-specific design gate

- Hard gate PASS: the unchanged styled demo passes twelve keyboard/form/RTL and
  narrow layout cases; the metadata harness passes native protection/feedback.
- Purpose gate PASS: no color, decoration, imagery, typography or motion changed.
- Liveliness PASS: the approved technical catalog E1/R2/M1 direction is preserved;
  the correction adds no public presentation or filler content.
- Craft PASS: five context regressions and native pointer/keyboard/form checks
  establish visible feedback, meaningful focus and guarded actions in this scope.

## Applying the overlay

Use .cache/batches/listbox-field-metadata/manifest.json, files/, diffs/ and evidence/.
Apply this small overlay after Listbox and the exact B metadata dependency.
No aggregate replacement or new package installation is needed. Generated build,
coverage, logs, manifests and native harness assets retain tool formats and are
verification-only exclusions. Maintained payload paths satisfy the repository
300-line/88-column/two-space rules. No root/fork-a/fork-b live source was edited.
No commit, push, publish, deploy or DNS action occurred.
