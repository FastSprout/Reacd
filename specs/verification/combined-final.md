# Combined local enterprise acceptance

Status: accepted locally on 2026-10-29. All 132 pinned inventory entries are Verified;
all 150 public component declarations have complete shadcn adapter mappings and
compiled public reference examples. No remote operation is part of this acceptance.

## Immutable source and reviews

The original repository baseline contains 1,032 maintained paths. All implementation
and integration work stays in .cache/workspaces/fork-a. The final executable candidate
is .cache/batches/combined-final-source-v4/checkpoint: 3,378 maintained paths.
Its manifest SHA-256 is
cf03fe27c401cbed8fc3a64c2167366c994b7810d236005efc3675082f96d48b.
The fifteen-path narrow correction manifest is
.cache/batches/final-browser-corrections/manifest.json, SHA-256
4db90f3b3c200141f10cb6789aaeaa4350a42dc960febe436ec01e9b9e328b77.
Final status/prose bookkeeping is a separately hashed overlay; executable source is
identical to this independently reviewed and fully executed candidate.

Original independent reviewers closed both axes against v4 without source edits or
heavy verification jobs. Reports live under the original repository's .cache/reviews/:

- independent-final-standards/v4-closure.md, SHA-256
  f5d699831151f1637144f203a0adf585bc0abc50d16e6cd803695a403a187d00.
- final-spec/v4-closure.md, SHA-256
  f0e8b87f2b0cbbd87525e455ab8ce9a4a1cabdb2a7d9b36384ecc44fa9a6028b.

Historical findings and diagnostic runs remain preserved, not rewritten as passes.

## Complete fresh execution

The unfiltered coverage run uses the official Vitest configuration, two workers and
.cache/vitest-combined-final for compiled transforms. Fresh test execution passes
2,783 tests across 907 files. Every one of 1,405 executable files reaches 100% in all
four metrics: 10,426 statements, 7,478 branches, 3,276 functions and 9,388 lines.
The 390 empty/type-only files are reported separately. No thresholds or runtime
coverage exclusions changed. Log: .cache/combined-final-coverage-v3.log.

All 1,042 discovered production Chromium scenarios pass across 80 files with the
configured two workers and zero retries, without a CLI worker override. This includes
both templates, narrow/RTL/200% geometry,
keyboard/native forms, retained portals, all five ordinary production entries and
154 actual MkDocs preview scenarios. Log: .cache/combined-final-browser-v4.log.
Browser traces and screenshots use .cache/combined-final-browser-v4-artifacts.

Four strict TypeScript projects, official typed lint, architecture/source policy,
schema freshness, example freshness, ordinary production build, packed consumer and
strict MkDocs plus compiled-preview build all pass on this source. The ordinary build
emits five HTML entries and 22 JavaScript chunks; the largest is 450,036 bytes against
the unchanged 500,000-byte limit. The largest docs preview chunk is 473,791 bytes.
Packed checks cover exports, strict consumer TSX,
negative fixtures, SSR and isolated state.

Source-closure logs use .cache/final-browser-repair-*.log. Final packed consumer and
compiled MkDocs logs are .cache/combined-final-package-v3.log and
.cache/combined-final-docs-v3.log. Exact sequential commands and exits are retained in
.cache/final-v4-acceptance-status.json. docs:check runs before browser acceptance.

## Documentation and development serving

Each of 150 public references embeds its actual compiled TSX example through the
closed preview registry. Isolated Jotai stores, both template controls, frame errors,
real interactions, root-relative assets and intentional image fallbacks are tested.
Use npm run docs:check, then the documented local HTTP server for generated site/.
Standalone MkDocs serve does not perform the preview-asset copy stage.

The original dev-module complaint has a separate real Chromium proof on local port
5175: optimized React, ReactDOM client and JSX dev runtime returned HTTP 200 with
JavaScript MIME; initial load and reload produced no page errors or failed scripts.
Evidence is the original repository's .cache/coordination/agent-a/dev-module-proof.json
and its sibling server log/script. That server was stopped. No Firefox binary was
available; neither this proof nor the browser suite claims Firefox or WebKit coverage.

## Corrections and limits

The initial whole-browser diagnostic passed 995 and failed 46 scenarios. Actual
integration failures were repaired without skipping scenarios: two domain-specific
example switch labels, the LocaleSelect family route, expansion of every matching
Full text disclosure, and exact fully clipped SDK-mirror classification. Negative
visible/unclipped and display-contents overflow probes remain active. All 87 affected
scenarios passed before the final unfiltered run; one new negative probe increases the
complete inventory from 1,041 to 1,042. No tolerance, timeout or retry changed.

The four-worker diagnostic then passed 1,020 and failed 22 documentation scenarios.
Every failing trace contains actual local-server connection reset/socket errors.
The separately frozen browser-execution-policy overlay (three internal/config paths)
sets a named two-worker local default. All scenarios remain mandatory; explicit CLI/CI
opt-in can use higher validated serving capacity. Its manifest SHA-256 is
ccf3a8a105ab90e9722640fe13562bea4246d2b9766a452f7e5be5a8295db679.
No executable implementation changed from the fully covered v3 runtime. The failed
four-worker log/artifacts and extracted connection evidence remain preserved.

Root Form/Tabs/Modal composition, Chat busy scopes, Editor field metadata, physical
native-form boundary and dependency-cycle corrections are included in the frozen
candidate. Their failing regressions and prior isolated evidence are preserved.
Native external-HTML SSR ancestry has the documented host limitation; reacd authoring
does not expose native HTML. Optional JSON routes retain their documented subset.
MUI remains later adapter work. Coverage/schema success is not universal UI proof.

No commit, push, publication, deployment, hosting or DNS change occurred. The configured
https://reacd.dev/ URL is canonical metadata only. Generated outputs, caches, installed
dependencies and virtual environments are excluded from source freezes; maintained
tooling/build modules remain included. Final metadata is checked with policy and a
fresh strict documentation build, with executable-source hash identity verified.
