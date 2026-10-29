# Collapsible

COLLAPSIBLE-001: Provide a separate named CollapsibleProps and controlled TSX component.
Require a nonempty label, boolean open, and onOpenChange(boolean). Accept only reacd
children, optional disabled, retainContent, and showTrigger. No native slots or styles.
The built-in labeled trigger is shown by default; showTrigger=false supports an
external control. Disabled blocks the built-in trigger, not host state updates.

COLLAPSIBLE-002: The shadcn adapter follows its Base UI Collapsible recipe. Use a native
button, linked expanded/control semantics, and a named content region. Enter and Space
toggle the panel and emit only a boolean. Host logic may reject a proposed transition.
The component cannot accidentally submit an enclosing form.

COLLAPSIBLE-003: Closed content unmounts by default. retainContent preserves local
descendant state but hides closed content and excludes it from keyboard navigation.
Propagate inactive ancestry to portalled child controls. Closing a retained panel clears
transient menus and hides nested dialogs without resetting controlled business values.
Nested disclosure panels remain independently controlled.

COLLAPSIBLE-004: Content and labels wrap at narrow widths and enlarged text. Both theme
profiles apply engine tokens. Theme changes preserve values. Do not add app-facing
breakpoints, dimensions, CSS, or icon customization.

COLLAPSIBLE-005: Generative version 0.2 binds open to writable boolean state. Children
are recursively validated declarations, including references/actions in closed panels.
The same TSX component and complete adapter render both authoring paths.

COLLAPSIBLE-006: Accept only after schema/type and interaction/failure tests, per-file
100% coverage, portable schema freshness, packed-consumer SSR, compiled documentation,
and browser acceptance for keyboard, retention, nesting, themes, and width/text matrix.

References retrieved 2026-10-29:

- https://ui.nuxt.com/docs/components/collapsible
- https://ui.shadcn.com/docs/components/base/collapsible
- https://base-ui.com/react/components/collapsible

The Nuxt reference requires disabled, controlled/external open, and configurable
unmounting. Its native slot, styling, and uncontrolled escapes become closed React
composition and host-owned state. The owned shadcn recipe uses the already installed
Base UI primitive and existing shadcn button, with engine-owned containment.
