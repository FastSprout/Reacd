# Verification status

The local enterprise checkpoint accepts all 132 pinned inventory entries and the full
150-component shadcn catalog. The fresh combined run passes 2,783 tests, all-four 100%
per-file coverage and 1,042 production Chromium scenarios. Independent Standards and
Spec reviews are closed. Exact commands, hashes and limits are recorded in
[combined acceptance](verification/combined-final.md).

## Historical local evidence, 2026-10-28 to 2026-10-29

Agent A's earlier isolated checkpoint passed 1015 tests, 100% coverage for 582
executable
files, and 328 Chromium scenarios, plus the complete local gate. Details:
[Agent A composition](verification/agent-a-composition.md) and the earlier
[Agent A foundations](verification/agent-a-foundations.md).
The historical entries below describe earlier accepted checkpoints.

- `npm run check` passed after the state, table, and geometry changes.
- TypeScript 7 compiled source, declarations, and the closed-TSX application.
- Typed lint passed without warnings.
- Repository policy checked dependency direction, application boundaries, source limits,
  and public facades. Integration tests remain colocated.
- Schema and example freshness checks passed for transport versions `0.1` and `0.2`.
- Instrumented source, demo, tooling, documentation examples, and all nine CLI entry
  points passed per-file 100% coverage in all four measured categories.
- Production library CSS, declarations, JavaScript, and the demo built locally.
- Packed consumer checks compile strict TSX from the archive outside the worktree,
  reject native JSX/styling/value/private-import fixtures, and execute Node SSR,
  isolated Jotai state, DataTable sorting, and all public exports.
- Consumer dependencies link to the locked local installation. This verifies the packed
  artifact; it does not claim a fresh registry installation was tested.
- Chromium passed 236 conformance scenarios across both token profiles.
- The production bundle gate verifies all JavaScript chunks against its byte budget and
  keeps catalog families/playground outside the static entry graph.
- Geometry scenarios cover widths 240, 320, 375, 600, 768, 1024, 1440, and 1920, nested
  containers, long text, local table scrolling, and 200% text.
- Control geometry checks verify slider value position and checkbox target size.
- Toggle thumb containment and state positions pass before/after 200% text, in LTR and
  RTL, against optimized production CSS.
- SSR hydration preserves initial state and isolates later client edits.
- Accordion has controlled TSX/JSON state, nested content, single/multiple modes,
  retained hidden panels, disabled controls, keyboard and container acceptance.
- Its documentation includes the same TSX source compiled and run by the catalog.
- Modal adds controlled TSX/JSON state, client portals, retained child state, nested
  focus management, non-modal and fullscreen behavior, and both-profile browser
  coverage. Public docs exclude colocated test and compiler artifacts.
- Collapsible adds controlled/shared boolean state, external triggers, retained hidden
  content, independent nested panels, and compiled public documentation. Retained
  Accordion sections now deactivate descendant portals, with a reproduced regression.
- RadioGroup and CheckboxGroup add controlled choices, described/disabled items,
  required native forms, wrapping orientations, selection limits, shared generative
  state constraints, and isolated SSR hydration. Compiled examples run in the catalog.
- MkDocs built with `--strict`; generative and DataTable guides return HTTP 200 on the
  local preview. `/specs/` returns HTTP 404.
- DOCS-013 passed: `npm run check` includes `docs:check`; its strict build passed. A
  temporary documentation fixture with a missing local link failed as expected. CI
  configuration creates the Python 3.13 environment and installs pinned tools. The
  remote CI workflow was not executed during local-only work.
- CLI tests run in a dedicated Node project with command-boundary doubles and real
  generated temporary workspaces. They cover ordered/fail-fast execution, generation and
  freshness modes, diagnostics, exit codes, and actual workspace removal.
- Policy now rejects an empty inventory. Packed acceptance prints success only after
  cleanup succeeds. Both regressions were reproduced before correction.
- Avatar and AvatarGroup add Unicode-aware fallbacks, image load/error recovery,
  accessible identities, empty data, and keyboard overflow disclosure. The real browser
  matrix verifies square/text containment at eight widths and 200% text in both
  profiles.
- GENSTATE-019 adds compiled public examples of shared readers/writers, host-owned
  read-only data, and a complete five-key DataTable declaration with tested transitions.
- Chip and Tooltip add named passive indicators, safe edge tracks, logical corners,
  hover/focus hints, controlled/automatic visibility, constrained read bindings,
  nearest-dialog portals, touch-safe child actions, and preserved retained-panel focus.
- Tooltip Escape now closes the hint before its containing dialog, including immediately
  after opening. A repeated eight-scenario browser regression checks both profiles.

Detailed state evidence and the UI delivery check are in
[Generative state verification](verification/generative-state.md).

Accordion catalog evidence is in [Accordion acceptance](verification/accordion.md).

Modal catalog evidence is in [Modal acceptance](verification/modal.md).

Collapsible and related regression evidence is in
[Collapsible acceptance](verification/collapsible.md).

Choice-group evidence is in [Choice groups acceptance](verification/choice-groups.md).

CLI evidence is in [CLI runner acceptance](verification/cli.md).

Avatar evidence is in [Avatar acceptance](verification/avatars.md).

Chip/Tooltip evidence is in [Chip and Tooltip acceptance](verification/chip-tooltip.md).

Kbd/Popover evidence is in [Kbd and Popover acceptance](verification/kbd-popover.md).

Skeleton/Empty evidence is in
[Loading and empty states](verification/skeleton-empty.md).

Bundle/loading evidence is in [Demo loading acceptance](verification/demo-bundles.md).

The latest combined check is recorded in `.cache/parallel-check-stable.log`: 818 unit
tests, per-file 100% coverage of 457 measured executable files, 236 Chromium scenarios,
packed-consumer acceptance, and strict MkDocs all passed.

The 18-entry parallel batch and its regressions are recorded in
[Parallel catalog acceptance](verification/parallel-catalog.md). There are now 31
individually accepted Nuxt inventory entries. The remaining 101 are still required.

Logs and browser artifacts are local generated files under `.cache/`, `coverage/`,
`test-results/`, and `playwright-report/`. They are excluded from source control.

## Scope outside this accepted local checkpoint

- MUI is a later adapter; shadcn/ui covers the current public catalog.
- Browser evidence is Chromium only; Firefox and WebKit are not claimed.
- Canonical-domain configuration is metadata, not remote hosting acceptance.

Coverage is execution evidence, not proof of all UI correctness. Inspection found a
slider positioning defect after earlier tests passed; the new regression checks failed
against the old build and passed after the trusted-engine correction.

No commit, push, package publication, deployment, hosting change, or DNS change was
performed. The configured `https://reacd.dev/` URL is canonical metadata only.
