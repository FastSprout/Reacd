# Drawer and Slideover

Status: Agent A implementation contract; root acceptance remains pending.

EDGE-PANEL-001: Drawer and Slideover are separately named TSX modules with their own
strict schema-derived Props. Both use the current Modal logical contract: title,
description, controlled open/onOpenChange, optional trigger/close labels, safe children
and footer, disabled/dismissible/modal/overlay/fullscreen/retainContent behavior flags.
Verified Modal source remains unchanged.

EDGE-PANEL-002: placement is top/bottom/start/end. Start/end resolve from scoped writing
direction inside the engine. Drawer defaults bottom; Slideover defaults end. Dimensions,
raw snap points, native events, CSS classes and positioning styles are not public. Panel
bounds and decorative handle dimensions come from named core policies.

DRAWER-001: The adapter uses installed Base UI Drawer. Its swipe dismissal follows the
resolved physical edge. Non-dismissible drawers refuse Escape, outside and swipe close
requests while keeping an explicit close action available. Optional handle defaults true
and is a decorative swipe affordance, not a keyboard-only drag requirement. All actions
also have ordinary keyboard/pointer controls.

SLIDEOVER-001: The adapter uses Base UI Dialog with edge positioning. It has sheet
semantics and no swipe/snap API. It traps focus and blocks background interaction only
when modal is true. The host can refuse requests by retaining controlled open state.

EDGE-PANEL-003: Both components inherit the current template and direction across
portals, name the dialog through native title/description semantics, return focus to
their trigger, and register a child Escape scope so nested popovers dismiss first.
Retained content cannot leave descendants active while an ancestor panel is closed. Long
titles/content wrap; bounded panels scroll instead of hiding excess text.

EDGE-TRANSPORT-001: JSON uses writable boolean state for open and bounded safe arrays
for children/footer. All descendant actions are validated before rendering. Host state
and Jotai values remain isolated and survive changing the active template.

Acceptance includes strict props/type rejection, all logical edges in scoped LTR/RTL,
trigger/focus return, non-dismissible and nonmodal modes, controlled refusal, nested
Escape ordering, retained state, SSR/hydration and live binding errors. Actual browser
checks cover both templates, narrow/wide layouts, 200% text, containment, focus and
swipe gesture dismissal. All owned executable files require 100% in all four coverage
metrics.

Primary references retrieved 2026-10-29:

- https://ui.nuxt.com/docs/components/drawer.md
- https://ui.nuxt.com/docs/components/slideover.md
- https://base-ui.com/react/components/drawer
- https://ui.shadcn.com/docs/components/base/drawer
- https://ui.shadcn.com/docs/components/base/sheet

This adapter uses installed Base UI Drawer instead of adding shadcn Drawer's Vaul
dependency. Raw snap-point/animation options remain outside the closed public contract.
