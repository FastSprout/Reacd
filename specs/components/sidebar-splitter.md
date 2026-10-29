# Sidebar and Splitter

Status: verified isolated implementation; pending integrated acceptance.

This batch starts after the current coordinated catalog gate. It must not be reported as
implemented because a component name appears in the catalog.

## Sidebar

SIDEBAR-001: A labeled complementary landmark accepts title, description, children,
header, footer, actions and collapsed-content slots. Every slot accepts only validated
reacd content. Side is logical start/end, respecting the nearest application direction.

SIDEBAR-002: Visibility is controlled by open/onOpenChange. The collapsible policy is
offcanvas, icon or none. Offcanvas preserves hidden child state; icon shows a safe
collapsed-content slot; none keeps content visible without a nonfunctional collapse
control. A named toggle remains available when collapsible content is hidden.

SIDEBAR-003: On narrow containers, the engine presents collapsible content through an
accessible menu with focus trapping, Escape/outside dismissal and focus restoration. The
host provides no CSS, dimensions or breakpoints. The responsive transition must not
unexpectedly move focus solely because the viewport changes size. An initial
desktop-open state must not force a mobile dialog open during hydration.

SIDEBAR-004: Closed appearance variants sidebar/floating/inset use adapter tokens. Title
and close controls remain reachable with long data, 200% text, RTL direction and compact
templates.

SIDEBAR-005: Desktop open/onOpenChange and mobileOpen/onMobileOpenChange are separate,
required controlled pairs, matching shadcn's separate desktop/mobile state model. A host
initializes mobileOpen to false for a closed mobile hydration. Neither viewport changes
nor desktop toggle changes write the other pair. The content tree is mounted once,
retained when closed, and never cloned into a second responsive copy. The none policy
keeps an inline complementary landmark on every viewport without a toggle or modal.

SIDEBAR-006: Mobile dismissal stays outside one scroll region containing the title,
content and footer. Enlarged headings cannot squeeze a field between separately fixed
header/footer regions. Content order remains stable and closing is always reachable
without scrolling past long application data.

Generative transport uses a boolean readWrite state binding for open and recursively
validates every slot and descendant action reference. mobileOpen has a second
independent boolean readWrite binding.

## Splitter

SPLITTER-001: A named group contains a bounded list of uniquely keyed panels. Each panel
has a label, validated child content and named constraints for minimum/maximum share.
Optional collapse behavior has an explicit collapsed share; partial mixes of implicit
and explicit initial sizes are rejected.

SPLITTER-002: A controlled panel-layout value contains percentage shares. Shares must be
finite, satisfy panel constraints, match panel cardinality and sum to the named total.
Resizing preserves the adjacent-pair total and all unaffected panel shares. There is no
arbitrary CSS or pixel sizing API.

SPLITTER-003: Handles support pointer dragging, cancellation, keyboard arrows, Home/End
constraints, disabled behavior and logical RTL horizontal direction. Keyboard handles
expose separator semantics, orientation, current/min/max values and the adjacent panel
IDs. Touch target size belongs to core policy.

SPLITTER-004: Pointer cancellation restores the previous controlled layout. Pointer
capture is released on cancellation, completion or unmount. The layout cannot remain
stuck in dragging state after losing focus/capture.

SPLITTER-005: Intrinsic content determines minimum safe panel size. At narrow widths, a
horizontal group reflows rather than clipping controls or text. Vertical groups require
an engine-owned meaningful extent; applications do not supply fixed CSS heights. Focused
controls remain reachable while resizing.

SPLITTER-006: Persistence is opt-in and owned by the state layer. Storage is untrusted
external data and must pass the same layout schema. Server-rendered markup must not read
browser storage or diverge during hydration.

SPLITTER-007: The controlled value is a readonly array of {id, share} records in panel
declaration order. Panel min/max defaults and total/rounding tolerances are named core
policies. All panels declare minShare and maxShare or use the same safe defaults;
initial shares always come from the controlled value, avoiding mixed initial defaults.
The optional collapsedShare must be smaller than minShare. Enter toggles the primary
panel between collapsedShare and its last expanded value. Only adjacent pairs resize.
Persistence uses the host's isolated Jotai store, not implicit localStorage reads.

SPLITTER-008: The private engine follows shadcn's resizable composition and APG keyboard
contract. It implements the closed percentage DTO directly so host-rejected changes,
pointer cancellation and atomic registry validation remain observable. It is not a
vendored copy of react-resizable-panels and does not claim identical dependency APIs.

SPLITTER-009: Reflow compares available inline space with measured rem-based minimum
panel tracks plus all handle targets. ResizeObserver watches both the group and a hidden
track measure, so larger text and higher panel counts can trigger reflow without an
application breakpoint. The measure is capped to its container to avoid creating scroll
overflow itself. A named compact-container threshold remains the conservative floor.

Generative state needs an explicit panel-layout kind, rather than reusing tableRows or
text to hide an unrelated data model. Its atom value, validation, definition signature,
live constraints and read/write access must integrate with the existing state registry
before generative Splitter is accepted.

## Acceptance plan

1. Property tests cover pair-total preservation, constraint boundaries, invalid numbers,
   panel identity/cardinality and collapse/expand behavior.
2. Schema and public type tests reject native children, callbacks in JSON, arbitrary
   styling, mixed defaults and incompatible state bindings.
3. DOM interaction tests cover every keyboard action, RTL inversion, pointer
   capture/move/end/cancel and controlled host updates.
4. SSR/hydration tests cover stable IDs, isolated stores, closed mobile Sidebar and
   persistence without hydration divergence.
5. Browser tests cover both templates, 240/320/768/1440 widths, 200% text, LTR/RTL,
   focus retention and containment during real pointer resizing.
6. Both adapters are registered in the exhaustive adapter catalog. Compiled public TSX
   examples use Jotai and real controls. Each production file has 100% statement,
   branch, function and line coverage.

## Primary references

- https://ui.nuxt.com/docs/components/sidebar
- https://ui.nuxt.com/docs/components/splitter
- https://ui.shadcn.com/docs/components/sidebar
- https://ui.shadcn.com/docs/components/resizable
- https://www.w3.org/WAI/ARIA/apg/patterns/windowsplitter/

Nuxt documentation retrieved 2026-10-29 into .cache/references/. Upstream CSS maps, raw
icon definitions, DOM storage APIs and custom handles are replaced with validated slots,
design tokens and explicit state contracts. The shadcn resizable dependency and its
primary API must be inspected before choosing an implementation; no dependency is added
by this specification.

SIDEBAR-007: Browser containment ignores only fully clipped native SDK input
mirrors: aria-hidden true, tabindex -1, fixed positioning, one-pixel width/height
and clip-path inset(50%) together. Keep the one-pixel boundary tolerance and
detect escaped visible controls and otherwise identical unclipped hidden inputs.
This test classification does not change runtime layout or hide generic elements.
