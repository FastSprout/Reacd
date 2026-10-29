# Listbox metadata production fixture recovery

Date: 2026-10-29. Status: isolated integration correction verified; combined
acceptance and final independent reviews remain coordinator-owned.

## Defect and actual red

The earlier metadata overlay froze two browser cases but left their destination
at /. Their private native harness remained in verification-only .cache evidence.
The combined ordinary demo therefore showed the public catalog rather than the
Control listbox, grouped native checkboxes or calls/submits test outputs.
This was an integration error in A's test delivery, not a Listbox runtime defect.

The coordinator's fresh 67-case production run provides the actual red evidence:
menus-editor-browser.log reports missing Control after the unchanged five-second
assertion and missing Readonly choice at the unchanged thirty-second test limit.
Its two metadata failure contexts are retained. The separate main Listbox failures
were also inspected: duplicate scoped switch/status names explain those failures;
no SDK geometry or keyboard fix was inferred. The page worker owns those public
example/browser naming corrections. This overlay does not touch them.

## Baseline and exact recovery

Fresh a-listbox-fixture copied 3,109 stable current A source paths, checking every
hash both during copy and afterward. The baseline preserves the accepted ordinary
index/temporal two-input MPA config. No root/fork-a/fork-b live source was edited.
Stable reviewed fork-a-editor dependencies are linked; no install occurred.

BROWSER-FIXTURE-005 and BUNDLE-010 preceded the maintained recovery. The original
ready native harness was copied byte-for-byte from the frozen metadata evidence
into test-support/browser/listbox-field-metadata.tsx. Its relative import depth is
already correct at that destination; no body, state, callback, markup or behavior
change was needed. Its original provenance hash is recorded in the manifest.

New demo/listbox-field-metadata.html bootstraps that trusted conformance fixture.
The Vite shared proposal adds only its third HTML input while preserving both
existing inputs. The two maintained browser cases change only page.goto URLs to
/listbox-field-metadata.html. Every original assertion and timeout is unchanged.

No library adapter, schema, public component, application example, main Listbox
browser suite or state contract changes. The existing test-support classification
already covers trusted native test scaffolding. No application HTML/CSS escape,
new coverage exclusion, policy relaxation, callback API or dependency is added.

## Verification

The standard node scripts/build.mjs command passes. All three HTML files and
manifest isEntry records exist; the normal asset inspection includes every emitted
fixture JavaScript chunk. Measurements: 17 JavaScript chunks, 1,782,525 total bytes,
1,541,397 initial-static bytes and a 405,209-byte largest chunk. The unchanged
500,000-byte per-chunk limit and lazy catalog graph checks pass.

All four strict TS7 projects, explicit no-ignore typed lint of the config,
maintained native fixture and two browser cases, plus repository policy pass.
Fifteen production Chromium cases pass through ordinary npm run preview on port
5209 with one worker: both metadata cases and all thirteen existing temporal
entry/recovery cases. This verifies the third entry without losing the previous
production proof route. There is no separate private Vite build dependency.

The metadata checks retain actual native pointer/keyboard suppression, grouped
feedback reading, exact logical callback arguments, native FormData, disabled OR,
readonly required rejection, meaningful scoped focus and explicit required false.
No production library runtime file changed, and no runtime coverage target or
threshold changed. Maintained paths satisfy 300 lines/88 columns/two-space rules.
The native harness retains React test state and DOM bootstrap solely as scaffolding.

## Scope-specific design gate

- Hard gate PASS: both existing metadata scenarios and thirteen temporal checks
  execute real protected native actions with explicit feedback in production.
- Purpose gate PASS: no styles, images, typography, decoration or motion added.
- Liveliness PASS: the approved E1/R2/M1 technical catalog remains unchanged;
  the exact prior functional acceptance fixture is recovered.
- Craft PASS: callback/form/focus/read-only/disabled assertions are preserved,
  including the original refusal and recovery behavior of the temporal proof.

## Applying the overlay

Use .cache/batches/listbox-metadata-fixture/manifest.json, files/, diffs/ and
shared-proposals/vite.config.ts.patch. This seven-path overlay has three new
paths and four modifications. Merge only the third input into the current Vite
config, preserving coordinator SDK vendor groups, both previous inputs and all
budgets. Never replace the entire shared config with an older snapshot.

Merge BUNDLE-010 and BROWSER-FIXTURE-005 deliberately. Retain the exact metadata
browser URL diff; no other assertion change belongs to this overlay. Original
harness bytes, library dependencies, ordinary entry records and actual red logs
are included as provenance/evidence. Logs, generated assets and manifests retain
tool formats. Complete combined acceptance is still due. No own browser/build
process remains active; the heavy slot returned to page. All work remains local
without commit, push, publication, deployment or DNS changes.
