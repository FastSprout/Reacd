# Sidebar and Splitter delivery

Status: verified isolated batch, pending Agent A integrated acceptance.

Workspace: .cache/workspaces/a-layout. Root and fork-a production source were not
modified. Frozen delivery: .cache/workspaces/a-layout/.cache/batches/sidebar-splitter/.
The generated manifest.json contains exact new and modified paths with file hashes.
Import new owned modules deliberately; merge modified shared files rather than replacing
Agent A's current aggregate files. Regenerate the central JSON schema after integration.

## Public contracts

- Sidebar has its own module and schema-derived SidebarProps. Required pairs are
  open/onOpenChange for desktop and mobileOpen/onMobileOpenChange for mobile.
- Sidebar title is required. Safe header, actions, footer, collapsedContent and ordinary
  children slots are optional. Logical start/end placement and sidebar/floating/inset
  appearances are closed contracts. Collapse policies are offcanvas/icon/none.
- Splitter has its own module and schema-derived SplitterProps. panels have unique id,
  label, safe content, optional minShare/maxShare defaults and optional collapsedShare.
- Splitter value is a readonly array of id/share records in declaration order, totaling
  100 within the named numeric tolerance. A complete controlled callback receives each
  candidate. No dimensions, native handles, persistence keys or style escape exists.
- Splitter keyboard resizing preserves adjacent totals; Enter collapse/restore respects
  secondary capacity. Pointer cancellation, lost capture and blur restore the drag's
  original layout. Disabled transitions cancel active dragging.

## State and generative transport

- Add the explicit panelLayout state kind in core/state-policy.ts, the state definition
  union and registry createEntry. Its strict schema is state/panel-layout/.
- The definition-signature and isolated registry machinery already handles the new kind
  generically. No persistence is enabled implicitly and no dependency is added.
- Sidebar has two independent boolean readWrite bindings. Splitter has one panelLayout
  readWrite binding. Live registry constraints reject incompatible host writes.
- Add SidebarNode and SplitterNode directly to the recursive GenerativeNode union.
- Add their schema factories to the discriminated union and visit all Sidebar slots and
  every panel content array. The action preflight must run before partial rendering.
- catalogBindings delegates to sidebarSplitterBindings for the new state contracts.
- GenerativeNodeView maps safe slots/panels and calls BoundSidebar or BoundSplitter.

## Adapter and renderer integration

- Spread sidebarSplitterEntries in the shadcn registry and extend the public catalog,
  name list, export barrel and exhaustive conformance examples.
- Import renderer/styles/sidebar.css and splitter.css from the global stylesheet.
- Spread sidebarSplitterVariables() into templateVariables.
- Sidebar uses a single retained Base UI dialog portal inside its stable shell. It is
  complementary and nonmodal on desktop, modal on narrow containers, and inline for the
  none policy. Closed portals are explicitly hidden to avoid retained-backdrop input
  interception. Desktop outside-pointer dismissal is disabled.
- A separate controlled mobile value prevents desktop-open hydration from opening a
  mobile modal. Changing container size does not write either visibility pair. Focus
  restoration is reserved for explicit modal interaction and reset on desktop changes.
- Splitter is an adapter-owned percentage engine following shadcn/APG composition. It
  does not vendor or claim to expose react-resizable-panels. No package changes exist.
- Splitter reflow observes real rem-track geometry and available width, accounting for
  panel count, handle targets and enlarged text. The hidden measurement cannot itself
  overflow its container. Vertical layouts use a named engine extent.

## Documentation and demo

- Public reference pages: docs/components/sidebar.md and splitter.md.
- Compiled Jotai examples: docs/examples/sidebar.tsx and splitter.tsx.
- Mount SidebarSplitterExamples before SplitView in LayoutExamples, giving responsive
  examples the whole available width. Merge the two MkDocs navigation entries.
- Examples exercise appearance, collapse, side, scoped RTL, orientation, disabled
  interaction, controlled resizing, reset and retained input values.
- Browser acceptance lives in demo/e2e/sidebar-splitter.spec.ts.

## Verification

Requirement IDs: SIDEBAR-001 through SIDEBAR-006 and SPLITTER-001 through SPLITTER-009.

- Focused owned gate: 44 passing tests in 17 files. All 24 executable owned files have
  100% statements, branches, functions and lines. Type-only/barrel files are empty
  execution reports, never hidden runtime exclusions. Report:
  .cache/coverage/a-layout/coverage-summary.json and .cache/owned-coverage.log.
- Shared regression gate: 101 passing tests in eight files, including complete adapter
  conformance, generative JSON schema, document validation and registry transactions.
- All four TypeScript projects and source policy passed. Type-aware lint passed with
  --no-ignore and explicit owned/modified source paths because .cache is ignored by the
  root repository. No lint rule or coverage threshold was lowered.
- 18 Chromium cases passed, covering both templates, 240/320/768/1440 widths, 200% text,
  scoped LTR/RTL, real keyboard/pointer actions, mobile focus trapping, close/Escape/
  outside dismissal, repeated viewport transitions, retained state and containment.
  Evidence: .cache/browser-layout-final.log. The isolated server uses port 5177.
- SSR/hydration preserves splitter IDs, starts mobile closed and isolates request
  stores.
- Schema/example freshness, build, packed consumer and strict MkDocs checks passed.
- Visual inspection covered .cache/sidebar-mobile.png and splitter-desktop.png. The
  mobile title, content and footer share a scroll region below the close control;
  typography follows the existing technical catalog. ENERGY 1, RHYTHM 2, MOTION 1.

Root combined coverage, package, browser and documentation checks remain Agent A's
acceptance responsibility. This isolated delivery does not mark inventory rows Verified.
