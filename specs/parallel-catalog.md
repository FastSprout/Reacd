# Parallel catalog execution

The catalog is implemented in parallel within the available worker limit. Public
availability and verified acceptance are separate milestones.

## Ownership

| Worker            | Component families                                           |
| ----------------- | ------------------------------------------------------------ |
| Layout            | Layout, Page, Dashboard, Content, and Separator              |
| Forms             | Form controls and form composition                           |
| Feedback and data | Element, Data, AI Chat, Color Mode, and i18n                 |
| Integration       | Navigation, shared registries, transport, and combined gates |

Calendar and the shared date/locale foundation belong to Forms alongside InputDate and
InputTime. The Element assignment excludes Calendar and the Layout-owned Separator so
these contracts have one owner.

Each component owner delivers its specification, named props, TSX declaration, shadcn
implementation, generative schema and bindings where applicable, colocated tests,
compiled examples, and public reference documentation.

## Integration contract

- Workers modify their component modules and private helpers.
- Integration owns shared registries, recursive transport switches, catalog navigation,
  MkDocs navigation, and verification inventory.
- Workers report concrete exports and required integration points per batch.
- Focused worker tests use one worker each. Integration coordinates shared builds,
  browser servers, full coverage, and package verification.
- No component becomes verified before the combined acceptance gates pass.
- All work remains local. No commits, pushes, publication, or deployment.

## Isolated subsequent batches

After a shared integration checkpoint, workers may continue the next batch in local
snapshots under `.cache/workspaces/<family>/`. Snapshots share the locked dependency
installation but have independent source, build and test outputs. They are pending work,
not part of the shipping source tree or its acceptance claims. No coverage exclusion or
threshold changes are permitted in snapshots. Vitest snapshot commands must set a
family-specific `--fsModuleCachePath` under their own `.cache/` directory; symlinked
dependency caches must not be shared with the root verification process or other
workers. The root test configuration also keeps its module cache in its own `.cache/`
directory, independently of the shared dependency installation.

Workers report changed paths and complete integration instructions. Integration reviews
and imports only the assigned changes, then runs the complete root gates again. Shared
root files remain integration-owned. This lets new component work continue while the
current root snapshot undergoes browser and package checks.

## Acceptance

Parallel work retains the engineering requirements in `AGENTS.md`: strict types,
complete adapter coverage, accessible behavior, tested browser reflow, and 100% per-file
statement, branch, function, and line coverage.
