# Agent A foundations acceptance

Date: 2026-10-29. Workspace: .cache/workspaces/fork-a. No root production source,
remote repository, publication or deployment was changed.

## Accepted scope

PageAside, PageBody, PageColumns, PageGrid and PageList reuse the existing layout
snapshot's exact owned modules. Link and Tabs extend their existing public modules.
These seven inventory entries are accepted at this local checkpoint. The public
catalog has 68 modules; the full 132-entry enterprise scope remains incomplete.

The latest user instruction selects an isolated Agent A copy. This supersedes the
coordination plan's root-workspace location without changing A/B family ownership.

## Reproduced corrections

- Page composition browser fixtures now scope RTL through App and check actual native
  direction. Document direction alone was insufficient because App owns direction.
- The imported PageAside hook uses the inline useMemo callback required by typed lint.
- Eight older application-context browser cases assumed a single global App. Adding
  another legitimate scoped preview made the locator ambiguous. They now identify the
  application by its exact content, retaining the original language/direction checks.
- New schema acceptance failed before Link and Tabs contracts were extended.
- A shared Tabs panel originally remounted when selecting an item-specific panel. The
  regression now checks preserved local child state. Shared content stays mounted and
  hidden, with unique panel and trigger relationships, alongside keyed item panels.
- Real browser manual-mode checks await the roving-focus destination before Space;
  this matches the headless primitive's asynchronous focus scheduling.

## Complete local gate

Log: .cache/a-navigation-check.log. npm run check passed every stage:

- Source and architecture policies, strict TypeScript across four projects, typed lint.
- Generated schema and runnable example freshness for both transport versions.
- 876 tests across 249 test files.
- All four coverage metrics at 100% per executable production file: 496 files,
  2780 statements, 1866 branches, 817 functions and 2582 lines.
- Production library/demo build, bundle budgets and packed external consumer checks.
- 268 Chromium scenarios across both templates, including 16 new page composition
  and 16 new Link/Tabs scenarios at 240/320/768/1440 widths, LTR/RTL and 200% text.
- Strict MkDocs build with canonical https://reacd.dev/ and internal specs outside docs.

Page cases measure flow versus row-aligned grids, sticky versus in-flow aside behavior,
list division, keyboard order and state retention. Tabs cases exercise disabled
skipping, manual/automatic activation, vertical/RTL keys, connected panels and retained
values. Link cases open real native new-window navigation and verify a null opener.
DOM tests also cover generative read/readWrite selection, invalid live writes,
preflight action validation, isolated SSR hydration and retained local panel state.

Coverage and schema validity are distinct from browser evidence. This checkpoint does
not accept later worker snapshots or claim completion of Agent A's remaining 44 entries.
