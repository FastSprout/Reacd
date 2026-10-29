# CLI runner acceptance

CLI-001: Include every owned executable `scripts/*.ts` and `scripts/*.mjs` in per-file
100% statement, branch, function, and line coverage. Test modules stay colocated and
excluded from production measurement. Do not add coverage ignores or alternate runners
that bypass the measured modules.

CLI-002: Main checks run their full ordered sequence and stop on the first failure.
Build removes stale library output before compilation and runs library CSS/demo builds
in order, followed by production bundle validation. Type checking includes source,
declarations, the demo, and documentation examples. Child failures propagate; later
stages must not run after failure.

CLI-003: Schema/example generators write their expected artifacts in generation mode.
Check mode never writes and fails on stale output. Schema output retains both versioned
IDs and valid JSON. Example output retains all declared scenarios. Read/write errors
propagate rather than reporting success.

CLI-004: Document validation requires an input path, reports successful validation,
prints actionable path/message diagnostics for invalid input, and sets a failing exit
code. Filesystem errors propagate. Policy discovery includes maintained source/config
families, reports file/position/rule diagnostics, and fails for any violation. An empty
source inventory fails with an instruction to use the repository root.

CLI-005: Packed-consumer checks reject malformed archive metadata, forbidden artifacts,
unexpected negative-compilation success, and incorrect diagnostics. Pack, extraction,
compiler, fixture, and runtime failures propagate. Temporary consumers/archives are
removed after success and failure; tests verify actual filesystem removal. Emit success
only after cleanup finishes. Cleanup errors must not print a success message.

CLI-006: Test doubles isolate external command boundaries without executing recursive
checks or publication. Filesystem acceptance uses generated temporary directories
outside the checkout. Real schema/example freshness, build, archive consumer, browser,
and documentation commands remain integration gates in `npm run check`.

CLI-007: Bundle validation reads the generated manifest and recursively inventories
JavaScript output. Invalid metadata, absent assets and rejected artifact budgets
propagate as failures before any success output. The policy and graph requirements
are defined in `demo-bundles.md`.

This closes the runner instrumentation gap only. It does not accept the remaining
component inventory, documentation references, or additional browser/platform scope.
