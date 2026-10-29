# Form submitting status correction

Date: 2026-10-29. Status: isolated implementation and verification complete.
Combined acceptance
and independent final B Standards/Spec review remain parent-owned.

## Baseline and ownership

Fresh a-form-status was copied only from the hash-verified 2,964-file
fork-a pre-review-fix-source checkpoint. Its manifest SHA-256 is:
0cdccd1c5e2460f5b94982fa27a09d78ac187402713a8d5d5d33c2214d4b50f7.
The reviewed fork-a-editor installed dependencies are linked read-only for use;
no installation through that link occurred. Root/fork-a/fork-b source is untouched.

## Requirement and correction

FORM-005 now explicitly applies RENDER-014 to controlled submitting feedback.
FORM-003 still requires the native form itself to expose aria-busy while submitting.
The regression first failed because the loading status had a busy form ancestor.

The sole production edit moves the existing role=status paragraph before the
native form, inside the unchanged TrustedFormBoundary. The controlled condition,
label text, error summary/association, native form identity, fieldset protections,
canonical FormData and guarded zero-argument onSubmit boundary stay intact.
No component props, schema, state contract, CSS, dependencies or aggregates change.

## Acceptance and evidence

The tiny colocated test failed at status.closest('[aria-busy="true"]') before the
edit, then passed after it. It checks no busy/inert ancestor, continued native form
busy semantics, protected submission, canonical values, stale-summary retries,
status removal and exactly zero callback arguments after a valid retry.
A first post-fix test attempted an unavailable toContainElement matcher; its
separate diagnostic is retained. Native Element.contains checks the same intended
ownership assertion without changing production behavior.

Twenty-two relevant renderer/state/docs tests pass across ten files. The sole
changed executable file has 100% statements, branches, functions and lines:
eight statements, nineteen branches, three functions and seven lines. Coverage
thresholds/exclusions/timeouts are unchanged.

Strict production noEmit, all four TS7 projects, explicit no-ignore typed lint,
source policy, official declaration/package/demo build and packed consumer,
negative fixtures, SSR/state/exports checks pass. Public docs and generated schema
bytes remain unchanged; no unrelated aggregate or documentation gate was altered.

Four production Chromium scenarios pass in demo/e2e/form-status.spec.ts, with one
worker on port 5205. They cover both templates at 360px, LTR/RTL, native
requestSubmit protections, summary association, retained/disabled FormData and
the visible status lifecycle. The first browser run reached the repaired status
assertions, then failed an overly specific new summary-description expectation.
Chromium computes the unchanged labelled alert reference as "Form errors"; the
alert itself retains its full visible error text. The final test checks both
facts. Failed logs/contexts are retained; no summary production code changed.
Structural status semantics do not demonstrate a screen reader announcement.

## Scope-specific design gate

- Hard gate PASS: four production cases verify live, guarded native actions,
  visible feedback and status outside busy/inert content in both templates.
- Purpose gate PASS: no decoration, images, fonts, colors or motion changed.
- Liveliness PASS: approved technical catalog E1/R2/M1 direction is preserved.
- Craft PASS: retries, errors, required controls, portal/nesting isolation,
  semantic status lifecycle and exact logical callback arguments pass.

## Applying the overlay

Use .cache/batches/form-status/manifest.json, files/, diffs/ and evidence/.
This five-path overlay changes one runtime renderer and its requirement, with
new unit/browser acceptance and this ledger. It needs no aggregate or package
change. Apply the exact baseline-hashed diff; do not replace unrelated shared
renderer changes. Original failures are retained and no pending check is hidden.

Maintained payload files satisfy 300 lines, 88 columns and two-space indentation.
Logs, coverage/build outputs, manifests and verification-only config retain tool
formats. No compiler/browser jobs remain active; the slot was handed to page.
Independent final B Standards/Spec review and combined acceptance remain due.
All work stays local; no commits, pushes, publication, deployment or DNS changes.
