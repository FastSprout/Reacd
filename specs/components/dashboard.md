# Dashboard composition

Status: implemented and verified in isolation; integrated acceptance is pending.

## Group and regions

DASHBOARD-GROUP-001: DashboardGroup coordinates two through eight uniquely keyed
regions. Exactly one region is a sidebar and at least one is a content panel. Each has
id, label, safe content and validated minimum/maximum expanded shares. The group has an
accessible label, a controlled panelLayout value and onValueChange, independent desktop
open/onOpenChange and mobileOpen/onMobileOpenChange pairs, and optional disabled state.
Every property is logical; no fixed viewport positioning, CSS sizes or storage API is
public. Additional safe children can host a search modal without entering panel layout.

DASHBOARD-GROUP-002: Expanded shares match region identities, order and constraints and
total the named percentage. Closing the sidebar preserves those saved expanded shares;
the engine derives its temporary collapsed presentation and reallocates released space
to an adjacent content region. Offcanvas and icon are closed collapse intentions. Resize
handles are inactive while collapsed or in narrow reflow. Reopening restores saved
expanded shares without remounting input state.

DASHBOARD-GROUP-003: The full available group width owns responsive classification.
Measured rem tracks, enlarged text and region count determine reflow. DashboardSidebar
passes this renderer-owned scope to Sidebar; measuring an already narrow sidebar column
must never force a desktop modal. No application breakpoint or width escape is exposed.
Nested dashboard groups have independent context, registry keys and region identities.

## Panels and navigation

DASHBOARD-SIDEBAR-001: DashboardSidebar consumes its nearest sidebar-region context and
the group's controlled visibility. It supports description and safe header, actions,
children, footer and collapsedContent. Group region labels supply title semantics. It
reuses Sidebar's single retained tree, focus/dismissal and mobile scroll behavior.
Invalid placement yields a diagnostic rather than uncontrolled hidden state.

DASHBOARD-PANEL-001: DashboardPanel provides header, children and footer slots with an
accessible label from its region or an explicit label when standalone. It introduces the
first main landmark or a named section within an existing main scope. It does not impose
a fixed content height or duplicate application main landmarks.

DASHBOARD-NAVBAR-001: DashboardNavbar supplies a title plus safe leading/trailing,
start/end and children slots. In a dashboard it includes the mobile toggle
automatically. Title fallback uses the region label, then the named generic default. It
creates no new banner landmark inside main content and accepts no native tag or heading
selector.

DASHBOARD-TOOLBAR-001: DashboardToolbar is a named action group with safe start,
children and end slots. It uses ordinary sequential keyboard order, rather than claiming
roving toolbar semantics for arbitrary child controls. Long controls wrap intrinsically.

## Shared controls

DASHBOARD-COLLAPSE-001: DashboardSidebarCollapse toggles only the nearest group's
desktop visibility and is available only in wide layouts. Its default visible label
reflects expanded/collapsed state; optional labels and disabled state remain closed.

DASHBOARD-TOGGLE-001: DashboardSidebarToggle toggles only mobile visibility and is
available only in narrow layouts. It remains keyboard named and follows Sidebar focus
restoration. Neither control changes the other's state during reflow.

DASHBOARD-RESIZE-001: DashboardResizeHandle is supplied automatically between adjacent
regions and can be declared as an additional resize control within a region. It consumes
its region's engine context, exposes the adjacent IDs and percentage bounds, and
delegates arithmetic/drag lifecycle to the existing Splitter foundation. Keyboard, RTL,
pointer cancellation, capture release and host rejection keep the same guarantees. It
introduces no native event or CSS sizing props. Its label can be customized, while
native handle behavior cannot be replaced with arbitrary slot content. It reports
missing context when used standalone.

## Search

DASHBOARD-SEARCH-001: DashboardSearch composes Modal and the accepted CommandPalette
contract. It has explicit open/onOpenChange, query/onQueryChange, groups and status,
filtering and selection behavior. Group actions and safe targets retain synchronous veto
semantics. Accepted selection closes the modal; rejected or invalid selection keeps it
open and blocks the target. It never injects unrequested color-mode commands, registers
document-global shortcuts or changes the controlled query on selection.

DASHBOARD-SEARCH-BUTTON-001: DashboardSearchButton is a closed, named search action with
required onPress and optional label/disabled. It opens the host's explicit search state
through that callback. No implicit singleton search registry, platform shortcut promise
or inherited vendor styling API is introduced.
All action callbacks receive zero arguments; state and selection callbacks receive only
their declared logical value. Native events and vendor detail objects never escape.

## Generative transport and acceptance

- Every component has its own strict schema, named Props, TSX function, shadcn adapter,
  docs/example and colocated tests. Generative nodes validate all safe slots and
  actions.
- Group bindings are panelLayout and two boolean readWrite references. State remains in
  isolated host Jotai stores. Search uses the existing text query/selection kinds and a
  boolean open binding. No new state kind beyond the accepted panelLayout is introduced.
  Desktop/mobile visibility bindings must use distinct keys, as must search query and
  optional selected-command bindings.
- Test ambiguous IDs, malformed shares, wrong component placement, unknown styling,
  callbacks in JSON, all slot traversal and read-only/incompatible registry bindings.
- Property tests cover collapsed presentation totals and preserved expanded values.
- DOM/SSR/hydration tests cover all controls, nested context isolation, main semantics,
  focus, input preservation, declined writes and deterministic initial mobile state.
- Browser tests measure wide region geometry, compact reflow and 200% text for both
  templates at 240/320/768/1440 widths and scoped LTR/RTL. Exercise actual pointer and
  keyboard resizing, all sidebar modes, focus return and search selection/veto/status.
- Keep 100% of all four coverage metrics per owned executable file. Root acceptance is
  separate from isolated evidence; no inventory entry is accepted by a wrapper alone.

## Primary references

The ten https://ui.nuxt.com/docs/components/dashboard-* pages were fetched on 2026-10-29
into .cache/dashboard-references/. shadcn Sidebar/Resizable, Base UI Dialog and the
accepted reacd Sidebar/Splitter and CommandPalette contracts supply the trusted
foundation. Nuxt's implicit storage, pixel/rem size modes, native event slots, raw
icons, CSS maps and singleton search shortcuts become explicit controlled React
contracts.
