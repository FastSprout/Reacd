# Popover

POPOVER-001: Provide separate closed schema, named Props/function, adapter, and tests.
Require a visible trigger label, title, controlled open boolean, and typed onOpenChange.
Accept safe content/footer, optional description/close label, logical
placement/alignment, arrow, modal, dismissible, retained content, disabled trigger, and
click/hover modes. Named timing choices replace raw delays. No DOM refs, CSS, offsets,
tags, or vendor slots.

POPOVER-002: The engine owns a native trigger. Click/keyboard/touch toggle the panel;
hover mode additionally supports delayed pointer entry and movement into its content.
Non-modal hover opening does not steal keyboard focus. Clicking or keyboard activation
uses normal focus entry; touch opening focuses the panel without forcing the keyboard.
Modality applies to click mode. Hover previews remain non-modal, as in Nuxt's separate
HoverCard implementation; setting modal does not turn a hover preview into a focus trap.
The title names a dialog. Focus enters appropriately, stays inside modal mode, and
returns to the trigger on dismissal. Always provide a visible close action. Disabled
blocks trigger activation; trusted host state may still open the panel explicitly.

POPOVER-003: Dismissible defaults true. False blocks Escape, outside press, and
focus-out dismissal while preserving the trigger and explicit close action. Nested
layers consume Escape before their containing popover/dialog, even with focus elsewhere.
Each panel owns a dismissal scope; ancestor scopes register it as one layer. Scope
leases clean up.

POPOVER-004: Use the documented shadcn Base UI composition. Position against the
trigger, flip/shift on collisions, wrap and scroll long content within available
viewport bounds, and propagate token variables. Keep initial positioning and closed
phases hidden. Interactive child portals use this panel as their nearest host. Nested
popovers/dialogs keep independent hosts/scopes; do not raise a global layer to simulate
containment.

POPOVER-005: Closed content unmounts unless retainContent is true. Retained closed
content is invisible/inert and deactivates descendant portals without clearing host
business values. Parent deactivation masks controlled open without remounting retained
content. Reopening an ancestor reapplies the child's controlled state. Theme changes
preserve data. Implicit dismissal events during ancestor deactivation must not clear the
child's controlled open value. Focus guards may receive focus transiently while the
primitive schedules focus wrapping; the settled focus remains in the modal panel.

POPOVER-006: Generative 0.2 requires a writable boolean open binding and recursively
validates children/footer even when closed. Reuse TSX components and the complete
adapter contract. SSR preserves the trigger; client hydration mounts popups without
mismatched identities or shared request state.

POPOVER-007: Require schema/type/interaction/error tests, full per-file coverage,
portable schema, packed consumer, SSR hydration, compiled docs, nested
portal/dismissal/focus tests, hover/touch, both templates, eight widths, RTL, and 200%
text acceptance.

References retrieved 2026-10-29:

- https://ui.nuxt.com/docs/components/popover
- https://ui.shadcn.com/docs/components/base/popover
- https://base-ui.com/react/components/popover
- https://github.com/nuxt/ui/blob/v4/src/runtime/components/Popover.vue

Nuxt's arbitrary anchor/content slots and cursor coordinates become an owned semantic
trigger, logical placement and safe content. Host-controlled open supports external
actions. Interactive contents stay reacd declarations; no raw event forwarding exists.
