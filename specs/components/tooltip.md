# Tooltip

TOOLTIP-001: Provide named per-component schema, Props, declaration, adapter, tests, and
public documentation. Accept safe reacd children, required nonempty text, logical
placement/delay, optional arrow/shortcut labels, and disabled state. Reject native
elements, browser event handlers, raw positioning, styling, and vendor slots.

TOOLTIP-002: Show supplementary text on mouse hover and keyboard focus. Escape and
leaving both trigger/popup dismiss it. Popup remains hoverable for reading. Touch must
not intercept the underlying action. Visible labels and essential descriptions must
remain available without the tooltip. Child actions and field semantics stay intact.

TOOLTIP-003: Static or disabled children have a focusable, named group anchor. Enabled
focusable descendants remain the tab stops without adding a duplicate wrapper stop.
Changes in descendant disabled/tabindex/content update anchor focusability. The group
label exposes the supplementary text without replacing descendants' accessible names. An
outer retained/hidden panel must not change the anchor's internal tab-stop choice;
reopening it preserves the original child-only tab order. Initial descendant
focusability is resolved in the layout phase, before paint, so the dialog autofocus does
not choose a temporary wrapper tab stop.

TOOLTIP-004: Use the documented shadcn Base UI tooltip composition. Collision avoidance,
viewport bounds, long-text wrapping/scrolling, theme variables, and nearest dialog
portal host are trusted-engine responsibilities. Hidden retained ancestors deactivate
popups. No child business state is remounted to reset tooltip visibility. An open
tooltip handles trigger Escape before the containing dialog, including the first frame
after opening. A later Escape can dismiss the dialog normally. The dialog owns a private
escape scope. Open hints register dismissal leases with it, so this ordering also holds
when keyboard focus is outside a hovered hint. Leases are released on closure/unmount
and never change business state outside the typed callback. New popup content stays
hidden during its initial positioning phase, and closed content is hidden immediately
while the primitive finishes unmounting it.

TOOLTIP-005: Support automatic transient open state or controlled open/onOpenChange.
Controlled props are a typed pair. Version 0.2 optionally binds open to writable boolean
state; omitted binding uses automatic state. Text and shortcuts remain literal in 0.2.
SSR/hydration preserve child identities without server popup claims.

TOOLTIP-006: Require semantic/type/failure tests, 100% per-file coverage, full adapter
mapping, portable JSON schema, packed consumer, SSR hydration, compiled docs, keyboard,
hover, ancestor lifecycle, both templates, eight widths, and 200% text acceptance.

References retrieved 2026-10-29:

- https://ui.nuxt.com/docs/components/tooltip
- https://ui.shadcn.com/docs/components/base/tooltip
- https://base-ui.com/react/components/tooltip

Nuxt content props become closed logical placement; numeric delays become named timing.
Shortcuts are display labels, not global keyboard registration. No interactive popup
content or detached vendor handles are public. Tooltip is supplementary; use explicit
descriptions or a separate Popover for essential information and interactive content.
