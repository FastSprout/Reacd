# CLI runner acceptance

Scope: CLI-001 through CLI-006, QUALITY-012, and PACKAGE-007; 2026-10-29.
The existing 37-component catalog is unchanged. Full enterprise acceptance remains open.

- CLI-001 PASS: `vitest.config.ts` includes executable TS and MJS entry points in the
  existing per-file 100% thresholds. All eight modules appear in coverage output.
  No runtime exclusions, ignore directives, or lowered thresholds were added.
- CLI-002 PASS: tests verify the complete main-check order, stop-on-failure behavior,
  output cleanup before compilation, both Vite stages, and all TypeScript projects.
- CLI-003 PASS: tests execute generation/check branches for both schemas and all five
  example scenarios. Version IDs, valid documents, stale output, no check-mode writes,
  and filesystem failures are asserted.
- CLI-004 PASS: validation tests cover usage, success, property/syntax diagnostics,
  exit status, and read failures. Policy tests cover discovery families, all reported
  violations, failing status, empty inventories, and discovery/read failures.
- CLI-005 PASS: package tests use real generated directories and remove them on both
  success and failure. Cases include malformed JSON/metadata, forbidden artifacts,
  pack/extraction/compiler/runtime failure, wrong negative status/diagnostics, failed
  fixture reads, workspace allocation failure, and cleanup failure.
- CLI-006 PASS: Node runner tests mock external command boundaries, avoiding recursive
  checks. The complete main command still executes real freshness/build/archive/browser
  and documentation acceptance. No publishing command is added or executed.
- PACKAGE-007 PASS: a regression test reproduced success output before failed cleanup.
  Success output now occurs after the finally block; cleanup failure prints no success.

## Measurement and execution

- `npm run check`: passed; log `.cache/cli-check.log`.
- 431 tests across 68 files passed, including 46 colocated CLI cases.
- 251 executable files have per-file 100% coverage; 100 empty files are skipped.
- Statements 1474/1474, branches 835/835, functions 440/440, lines 1350/1350.
- All 56 Chromium scenarios passed; strict MkDocs and packed-consumer acceptance passed.
- Source limits, strict TypeScript 7, and typed lint passed without safety suppression.
- A real invocation from a generated empty directory returned exit 1 with repository
  root guidance; its temporary directory was removed afterward.

Each entry below reports 100% statements, branches, functions, and lines. Categories
with no executable branches/functions follow the coverage reporter's zero-count rule.

| Measured entry point | Additional behavior evidence |
| --- | --- |
| `scripts/build.mjs` | Removal precedes compiler; every failed stage stops the build. |
| `scripts/check.mjs` | All ten local gates execute in order; the first failure stops. |
| `scripts/typecheck.mjs` | Declarations, source, demo, and docs are checked. |
| `scripts/schema.ts` | Both contracts generate/check; either stale output fails. |
| `scripts/examples.ts` | Every scenario generates/checks; stale output never writes. |
| `scripts/validate.ts` | Usage, valid/invalid input, path diagnostics, and exit code. |
| `scripts/policy.ts` | Source discovery, violations, empty inventory, I/O failure. |
| `scripts/package-check.ts` | Real workspace cleanup and compiler diagnostic checks. |

## Regressions and evidence limits

The initial measured run, `.cache/cli-coverage-red.log`, reported every CLI entry at
0%. Adding the files to the instrumented set exposed the gap rather than treating
unmeasured runners as covered.

The new empty-inventory test first passed through the old policy without an error.
The corrected runner throws actionable guidance instead of silently skipping checks.
The cleanup test first caught a printed success message after removal was configured
to fail; moving that message after cleanup corrected the behavior.

The runtime test project retains its JSDOM setup. CLI tests run in Node without DOM
shims, preserving file URLs and native filesystem behavior. Package command-boundary
tests do not themselves prove compiler/export correctness; the real packed-consumer
gate independently provides that evidence.

Historical component reports retain the metrics and instrumentation limits measured
at their acceptance. This report supersedes their outstanding CLI-coverage note.
The remaining catalog, public references/examples, broader SSR/platform coverage, and
demo bundle splitting remain open. No commit, push, publication, or deployment occurred.
