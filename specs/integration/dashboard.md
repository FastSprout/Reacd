# Dashboard delivery

Status: verified isolated batch, pending integrated acceptance.

Source: .cache/workspaces/a-layout. Frozen delivery: .cache/batches/dashboard/.
manifest.json lists exact new and modified paths, hashes and baseline hashes. Root and
fork-a were untouched while implementing this batch. Do not replace shared aggregates;
merge the proposed additions and regenerate the central generative JSON schema.

## Contracts

Ten separate modules expose schema-derived named Props: DashboardGroup,
DashboardSidebar, DashboardPanel, DashboardNavbar, DashboardToolbar,
DashboardSidebarCollapse, DashboardSidebarToggle, DashboardResizeHandle,
DashboardSearch and DashboardSearchButton.

DashboardGroup requires two through eight uniquely keyed regions, exactly one sidebar,
at least one content panel, expanded panelLayout value/onValueChange, independent
desktop and mobile visibility pairs and an accessible label. Collapse is offcanvas or
icon. Collapsing derives presentation shares without changing the saved expanded value.
Named core policies own defaults and limits. Action callbacks receive zero arguments;
state and selection callbacks receive only logical values, without native/vendor events.

DashboardSidebar consumes group state and provides safe content slots. The full group
width owns responsive scope. The new private SidebarEnvironmentContext carries that
classification and the actual mobile trigger to Sidebar. Merge the small Sidebar adapter
change over the previously frozen Sidebar batch; its public API does not change.
The actual wide sidebar column remains nonmodal even when narrower than 768 pixels.

The first eligible content panel owns main semantics; other panels and nested scopes
remain named sections. Navbar headings follow main ownership. Toolbar uses a named
group and ordinary Tab order. Parent integration may adapt headings to its newer shared
heading context while preserving the same landmark tests.

Resize controls reuse Splitter arithmetic, key handling and pointer lifecycle. Group
supplies automatic handles; an additional handle can consume its preceding region
context. Narrow/collapsed layouts remove active handles. Disabled and declined writes
retain controlled values. Invalid context yields a diagnostic.

DashboardSearch composes Modal and CommandPalette with explicit open/query/selection.
False selection veto keeps the modal open and blocks the target. Invalid async returns
surface an error. Accepted generative selection writes selected key and closes the modal
atomically before allowing the registered action. No global shortcut or persistence is
implicitly registered. No new dependencies or state kinds are introduced.

## Integration points

- Consume the separately frozen CommandPalette foundation from a-navigation. Its files
  are already in this snapshot baseline and are not included as Dashboard-owned paths.
- Merge ten exports, names, public schemas, registry entries and exhaustive fixtures.
- Add dashboard CSS to renderer/styles.css; it consumes existing template variables.
- Recursive generic interfaces must appear directly in GenerativeNode. This snapshot
  still has them in document.schema.ts. The receiving fork now splits generative-node.ts
  and visit-nodes.ts: move the corresponding type/visitor additions there deliberately.
- Traverse every region content and safe slot. Add dashboardNodeSchemas to runtime
  factories, dashboardBindings to binding dispatch and registered SearchButton actions
  to preflight. Keep missing actions rejected before partial rendering.
- GenerativeNodeView delegates to the new dashboard-node-view helper. Avoid exceeding
  the central file's 300-line limit; its refactors may need another dispatcher.
- Group visibility binding keys must differ. Search query and optional selection keys
  must differ. Live constraints and isolated Jotai registries remain authoritative.
- Merge demo mount, ten MkDocs entries and component index additions. The single
  compiled example exercises all ten components, actual callbacks and fixture controls.
- Regenerate schema/generative.schema.json instead of copying its snapshot wholesale.

## Verification

The scoped gate passed 159 tests in 38 files, including original Sidebar/Splitter
regressions, exhaustive adapter conformance, preflight and failed-write recovery,
isolated SSR/hydration and compiled runnable examples. All owned executable runtime
files have 100% statements, branches, functions and lines. Exact counts and the complete
coverage command are retained with the frozen evidence.

Eighteen Chromium scenarios passed against the production build on port 5177. The
matrix covers both templates at 240/320/768/1440 pixels, scoped LTR/RTL and 200% text.
It measures actual wide-region geometry, tests retained input, focus return, physical
pointer resize/cancellation, keyboard resize, third panel, containment and search.
Additional cases cover icon collapse and preserved expanded shares, rejected selection,
loading/error/ready transitions and successful retry. Screenshots do not substitute for
geometry or interaction. Wide and mobile screenshots were visually inspected.

Strict TS7 projects, explicit type-aware lint of changed source, maintained-file policy,
schema/example freshness, library/demo build, packed consumer and strict MkDocs passed.
The callback regression first failed on native event leakage, then passed after wrapping
DashboardSearchButton's action. Frozen evidence retains that failing-before record.

## Delivery gate

Approved technical catalog direction remains ENERGY 1 / RHYTHM 2 / MOTION 1. The
example is explicitly fixture data. No marketing claims, fabricated people or assets
were added. Text wraps, actions are named and functional, keyboard focus remains
visible, mobile content scrolls and close controls remain reachable at enlarged text.
Internal specifications remain outside docs. Integrated inventory status stays unchanged
until the receiving fork passes its complete combined gate.
