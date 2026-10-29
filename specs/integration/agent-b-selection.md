# Agent B selection foundation

Date: 2026-10-29. Source: fork-b. Scope: reusable closed selection contracts and the
approved generic selection-state key capacity. This does not complete Select or menus.

SELECTION-001 through SELECTION-005 define readonly option catalogs, unique canonical
keys, single empty string and multiple empty array. Disabled existing choices remain
valid; new disabled choices and malformed/duplicate SDK proposals are rejected.

Generic selection state accepts keys up to CONTENT_POLICY.maxLabelLength (1000), with
its existing bounded selection count. Parent approved this isolated schema change in
STATE-SELECTION-001. DataTable row IDs remain capped at 80; component catalog
constraints still reject unknown DataTable/Tree keys and oversized InputTags values
after widening.
No core state policy or registry implementation changes belong to this batch.

Six tests in two files pass in .cache/selection-capacity-after.log. Initial missing
modules and the previous 80-character generic limit failed in selection-before.log and
selection-capacity-before.log. Duplicate proposal regression failed before the early
uniqueness guard in selection-duplicate-before.log. Final focused coverage evidence is
.cache/coverage-selection/coverage-summary.json: every executable owned file is 100% in
statements, branches, functions and lines. The unchanged global thresholds report other
unexercised files, so the focused coverage process exits 1; no thresholds were lowered.

No-ignore typed lint passes in .cache/selection-lint.log. The whole repository type run
in selection-select-types.log currently reports another worker's unfinished Editor files
and an in-progress Select type assertion; no selection-foundation diagnostics occur.
Full combined types remain a parent gate. All batch maintained files satisfy 300 lines,
88 columns and two-space indentation. No dependency changes or browser claims apply to
these pure data contracts. Work is local; no commits, remote writes or publication.

Agent A menus may import the foundation from schema/selection/index.ts. Public option
shape: value, label, optional description and disabled. Maximum catalog count is 100;
canonical keys retain host spelling and reject edge whitespace. Keep per-component
membership constraints when sharing the generic selection state kind.
