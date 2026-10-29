# Modal

MODAL-001: Provide a controlled component with title, description, boolean open state,
typed onOpenChange callback, component body, optional footer, and optional logical
trigger label. No DOM refs, styles, classes, or vendor props are public.

MODAL-002: Default modal behavior traps focus, prevents background interaction, restores
focus on ordinary close, and exposes an accessible title and description. Ancestor
inactivation disables focus restoration into the stale scope: it must not refocus an
inactive automatic tab trigger and reactivate a hidden panel. Nested modals dismiss in
stack order. Programmatic opening is supported without a trigger.

MODAL-003: Dismissible defaults to true. False blocks Escape and outside dismissal but
preserves a visible, labeled close action. Controlled host logic may reject close
requests. Non-modal mode leaves background interactive and omits backdrop.

MODAL-004: Overlay defaults to true; fullscreen is optional. Long content scrolls inside
the dialog without widening the viewport. All text and controls remain reachable at
narrow widths and enlarged text. Tokens and state contexts propagate through portals,
including nested dialogs.

MODAL-005: Closed content unmounts by default. retainContent keeps child state and DOM
mounted while making the closed panel inert, invisible, and non-blocking. Retaining
closed content must not keep a focus trap or background scroll lock.

MODAL-006: Generative 0.2 binds open to a writable boolean definition and validates
recursive body/footer declarations, even while closed. Use the same adapter as TSX.

MODAL-007: Require schema/type tests, owned per-file 100% coverage, adapter and
packed-consumer conformance, compiled documentation source, and browser tests for focus,
dismissal, nesting, scroll, themes, and narrow/zoomed layouts.

MODAL-008: Portalled child controls mount inside their nearest dialog host. They must
remain clickable, keyboard-accessible, and inside the active focus boundary. Nested
dialogs use distinct hosts; raising all global popup layers is not enough. This routing
is private renderer/adapter context, never an application DOM prop. Closing a retained
host clears transient child menus, without resetting their controlled business values.
Nested dialogs cannot stay visible after an ancestor closes; reopening a retained
ancestor applies its child's controlled open state. Parent initial focus must defer to
an already active nested dialog so reopening a retained host cannot immediately dismiss
its controlled child through focus-out.

MODAL-009: Each dialog owns a private Escape scope for nested non-modal layers. A
visible tooltip consumes Escape before its dialog even when focus is outside the
tooltip's anchor. Closed/unmounted layers release their leases. The next Escape follows
normal dialog dismissal. Nested dialogs retain independent scopes and existing stack
ordering.

References retrieved 2026-10-28:

- https://ui.nuxt.com/docs/components/modal
- https://ui.shadcn.com/docs/components/base/dialog
- https://base-ui.com/react/components/dialog

The owned shadcn Modal recipe uses Base UI's current Dialog lifecycle for retained
content. Existing shadcn components keep their pinned new-york Radix recipes. No
unprocessed registry placeholders or vendor styling APIs enter the public API.
