# ContextMenu and DropdownMenu

Status: Agent A implementation contract; root acceptance is pending.

ACTION-MENU-001: Each component has its own schema-derived Props and named TSX module.
Both require label, controlled open/onOpenChange and a bounded keyed items collection.
DropdownMenu owns its named button trigger; ContextMenu owns a keyboard-focusable named
context area with safe children. Disabled roots cannot open. Native HTML/CSS/events,
vendor render functions, coordinates and unrestricted popup dimensions are private.

ACTION-MENU-002: Items form a strict discriminated union: action, link, checkbox, radio,
label, separator and submenu. Submenus contain one bounded level of leaf items. Root and
child item keys are globally unique; radio option values are unique within a group.
Collection and total-item budgets belong to named core policies.

ACTION-MENU-003: Actions receive no DOM event. Checkbox/radio callbacks receive their
logical boolean/string value. Synchronous boolean|void returns permit acceptance or a
false veto. Invalid runtime returns fail closed with visible diagnostics. Action items
close by default; choice items stay open by default. A closed closeOnSelect flag can
override that behavior. Links use safe native href/newWindow behavior; disabled links
have no navigation target. Dangerous intent changes tokens, never HTML or CSS.

ACTION-MENU-004: Base UI owns keyboard roving, typeahead, focus return, pointer intent,
outside dismissal and submenu navigation. Context targets support right click,
ContextMenu key and Shift+F10, with long-press behavior from the native primitive.
Nested Escape dismisses the child layer before its parent. Portals inherit scoped
template/direction and collision bounds. Long labels wrap and oversized menus scroll.

ACTION-MENU-005: Dropdown modal behavior is a closed boolean. ContextMenu follows its
primitive's modal behavior. Applications do not provide placement pixels or breakpoints.
Readonly choice bindings display their current values with disabled editing controls.

MENU-TRANSPORT-001: Generative open uses writable boolean state. Checkbox/radio values
bind existing boolean/text state in read or readWrite mode. Every reference is validated
before rendering, including submenu references. Failed writes retain current values and
show diagnostics. Named actions require own registered functions at activation, even if
the host mutates its action table after initial validation. No new state kind or public
action context is introduced.

Acceptance covers strict schemas and consumer types, native target safety, no-op and
ambiguity rejection, collection budgets, key/value consistency, every item kind, veto,
read/write isolation, nested Escape/focus, disabled roots/targets, SSR/hydration and
real keyboard/pointer/browser geometry at narrow/wide widths, both templates and RTL.
Every owned executable file needs 100% statements, branches, functions and lines.

Primary references retrieved 2026-10-29:

- https://ui.nuxt.com/docs/components/context-menu.md
- https://ui.nuxt.com/docs/components/dropdown-menu.md
- https://base-ui.com/react/components/context-menu
- https://base-ui.com/react/components/menu

The one-submenu-level limit and closed token-backed vocabulary are explicit adaptations
of upstream's more permissive recursive styling and rendering APIs.

Keyboard conformance note: Chromium on macOS did not synthesize a context-menu event for
Shift+F10 on Base UI's focusable context trigger. The trusted adapter handles
ContextMenu and Shift+F10 explicitly and dispatches a native context-menu event anchored
to the trigger bounds. No native event hook is exposed to applications.
