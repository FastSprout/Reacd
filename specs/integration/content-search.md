# Content search delivery

Isolated source: `.cache/workspaces/a-content`. Scope: ContentSearch and
ContentSearchButton. Reuses the separate frozen ContentSurround delivery. No dependency
or state kind is added. Requirements: SEARCH-001 through SEARCH-005 and COMMAND-004.

## Contracts and implementation

ContentSearch combines Modal and CommandPalette. Required controlled visibility and
query stay independent. Optional selection veto runs before closing or executing a
command. Invalid asynchronous decisions fail closed with feedback inside the dialog.
SearchButton emits exactly one logical boolean and installs no global shortcut.

Generative open/query bindings require writable boolean/text state. Optional selected
key publication and automatic close share one registry transaction; a refused write
preserves both keys and blocks the target. Footer references are traversed before any
partial render. Rejected writes and subsequent recovery remain observable.

The existing BoundCommandPalette model is extracted into private useCommandModel so
search composes its real binding constraints/action guards. No new manager API is
exposed. All public modules retain named schema-derived Props and ReactNode returns.

## Review corrections

A real Chromium matrix found that Modal lost scoped App direction across its portal.
The new failing Modal regression and exact native dir propagation repair the shared
boundary; document direction is unchanged. Do not replace this with document.dir.

Native CDP IME produced Enter with isComposing=true and keyCode13. Base UI's existing
229 guard still executed the selected command. A failing typed-query unit regression
and real-browser reproduction precede the private input capture guard. Both13 and229
cases now defer selection; normal keyboard selection remains covered. Preserve the
shared CommandPalette adapter/test/spec delta when importing this batch.

## Integration

The manifest separates exact new paths, baseline-hashed shared modifications and
aggregate proposals. Copy reviewed owned modules; merge proposals deliberately.

- Add three Content components to catalogs, exports and exhaustive adapter fixtures.
- Add contentSearchEntries to the registry and ContentSurround to contentEntries.
- Add both private CSS imports; there are no additional template variables.
- Add ContentSearchNode directly to GenerativeNode, its runtime schema factory, and
  footer traversal. Add ContentSearchButton/ContentSurround leaf schemas.
- Search groups share CommandPalette action-reference preflight. Bind visibility and
  recurse through the existing command query/selection binding constraints.
- Dispatch search/button to BoundContentSearch/BoundContentSearchButton and surround
  to its public facade. Preserve the parent's family dispatcher refactor.
- Merge compiled docs examples and NavigationExamples mounts, MkDocs navigation, public
  catalog links and packed-consumer declarations/assertions. Regenerate JSON schemas.
- Import Modal direction and CommandPalette IME shared corrections plus their tests.

## Scoped evidence

- Red logs: .cache/search-red.log, search-direction-red.log,
  search-ime-unit-red.log and search-ime-diagnostic.log. The latter observes native
  Enter13/isComposing=true; temporary instrumentation is absent from maintained tests.
- 44 focused tests in13files passed;17 executable new/changed files measured100% in
  all four metrics:138statements,116branches,39functions,122lines;6 empty files.
  Report: .cache/search-coverage/coverage-summary.json and search-coverage.log.
- Generative hydration preserves query after closing and a new SSR request remains
  isolated, with no recoverable hydration errors.
- 17 production Chromium cases pass: two templates,240/320/768/1440 widths, scoped
  LTR/RTL,200% text,640px height, disabled trigger, keyboard focus restoration,
  selection veto/recovery, loading/error/empty results, nested native Select and IME.
  Log: .cache/search-browser.log. No application HTML/CSS/DOM mutation is introduced.
- Compact320pxRTL screenshot inspected after the passing visual rerun:
  .cache/content-search-compact-rtl.png. Dialog scrolls internally at enlarged text;
  controls remain contained and reachable. Log: .cache/search-visual.log.
- Strict types, actual typed lint, source policy, schema generation, production build,
  packed consumer and strict MkDocs pass. Logs: .cache/search-{types,lint,policy,
  schema,build,package,docs}.log. Packed fixtures include all three Content facades.

These scoped results are delivery evidence. Integrated full coverage, schema freshness
and browser regressions remain the parent's acceptance gate. Inventory is not changed
by this delivery and schema validity does not prove browser layout correctness.
