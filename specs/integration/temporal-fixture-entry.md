# Temporal conformance production entry

Date: 2026-10-29. Status: isolated integration correction verified; complete
combined acceptance and independent final B review remain parent-owned.

## Actual defect and baseline

The original temporal-recovery freeze already included four trusted test-support
fixture/config files. They were imported into A. The defect was missing ordinary
production build wiring, not omitted fixture source or a Date/Time runtime defect.
The old private Vite proof emitted its own entry, while normal demo output only
contained index.html. Requests to /temporal-recovery.html received the catalog
fallback, so the unchanged twelve browser cases found no temporal proof regions.

Fresh a-temporal-proof contains 2,967 hash-verified source paths from immutable
pre-review-fix-source plus the verified isolated Form status correction. No live
root/fork-a/fork-b source was edited. Stable reviewed fork-a-editor dependencies
are linked; no install was performed through the link.

BROWSER-FIXTURE-001/004 and BUNDLE-009 preceded the correction. The entry smoke
first failed against the old ordinary production artifact: date reset proof
region count was zero, expected one. The standard assertion timeout was unchanged.
The red artifact manifest hash, source hashes, log and browser context are kept.

## Minimal correction

New demo/temporal-recovery.html bootstraps the original
../test-support/temporal-recovery-browser.tsx module. The shared Vite proposal adds
only explicit ordinary HTML inputs for index.html and temporal-recovery.html.
The original harness is neither moved, copied nor modified. Its SHA-256 remains:
36302c9300e6e1a9d8abea86a894aaf8858902175072c4f1222c44de0abb1fc7.
Its native forms, explicit state, reset/focus behavior and template toggle retain
exact semantics. The previous standalone proof configuration remains usable.

There is no production library runtime edit, new API, fixture logic, dependency,
coverage exclusion, source-policy relaxation, skipped scenario or raised limit.
The existing test-support fixture classification remains unchanged. Static HTML
is trusted conformance bootstrap; application authoring remains closed reacd TSX.

## Verification

The ordinary node scripts/build.mjs command passes, including declarations,
styles, the standard demo MPA and existing manifest/asset-budget checks. Both HTML
entries and their JavaScript assets exist and are marked isEntry in the manifest.
All fixture assets remain visible to the ordinary asset inspection. Measurements:
15 JavaScript chunks, 1,686,137 total bytes, 1,454,403 initial-static bytes and
427,482 largest-chunk bytes. The fixed 500,000-byte limit and lazy view contracts
are unchanged; no extra SDK grouping or budget adjustment was needed.

Thirteen production Chromium scenarios pass on port 5207 with one worker: the
new entry smoke and all twelve original Date/Time recovery cases. Those twelve
source bytes, timeouts and assertions are unchanged. Cases cover both templates,
focused programmatic/consecutive resets, complete native reset DTOs, unrelated
field reset, host refusal, readonly/disabled protections, native serialization,
external recovery and same-canonical-value unfinished drafts. This is real DOM
interaction evidence, not schema-only rendering claims.

All four strict TS7 projects, explicit no-ignore typed lint of the shared Vite
config, unchanged native fixture and new entry smoke, plus source policy pass.
Maintained changed paths and the unchanged fixture satisfy 300 lines, 88 columns
and two-space indentation. No production runtime file changed, so this correction
adds no runtime coverage target and changes no existing coverage configuration.
Public docs, schema, package and library exports are unchanged.

## Scope-specific design gate

- Hard gate PASS: thirteen native proof scenarios execute through
  ordinary production output, with real actions and explicit feedback.
- Purpose gate PASS: no visual decoration, fonts, imagery, colors or motion added.
- Liveliness PASS: approved technical E1/R2/M1 catalog direction is preserved;
  the existing two-template fixture is reused without presentation changes.
- Craft PASS: native keyboard/pointer/reset/focus and controlled-state proofs
  run through the maintained ordinary entry, without private build dependency.

## Applying the overlay

Use .cache/batches/temporal-entry/manifest.json and files/. The six-path payload
has four new paths and two modifications. vite.config.ts is a shared proposal:
merge only the explicit two-input intent into the coordinator's current config,
preserving newer vendor groups and all budget policy. The exact small diff is
also frozen separately in shared-proposals/vite.config.ts.patch. Do not replace
the current whole Vite config. Merge the BUNDLE-009 requirement deliberately.

No test-support payload is needed: verify its dependency hashes instead. The
existing full-suite discovery automatically includes the entry smoke and original
temporal-recovery spec. The verification-only Playwright config merely selects
these thirteen cases and serves ordinary npm run preview output; it uses no
private Vite root or alternate build. Complete combined full-suite acceptance
remains due after integration. Logs, manifests and generated build output retain
tool formats. No own build/browser job remains active; the slot returned to page.
All work stays local: no commit, push, publish, deploy or DNS action occurred.
