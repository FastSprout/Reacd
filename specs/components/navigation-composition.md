# Navigation composition

Status: implementation in an isolated Agent A snapshot. No root acceptance claimed.

NAV-COMPOSITION-001: FooterColumns, NavigationMenu and Stepper each have their own
strict schema, inferred named Props, public TSX function and shadcn adapter entry.
Native tags, CSS, arbitrary event handlers, dimensions and vendor types are private. All
collections have bounded sizes and unique stable keys. Safe links use the existing link
target validator. A leaf cannot declare both href and onPress.

FOOTER-COLUMNS-001: A named navigation landmark presents keyed columns with a label and
keyed links. Optional left/right safe-content slots supplement the columns. Disabled
links have no navigation target and actions are native disabled buttons. Empty columns
and empty collections are valid. Headings and lists remain semantic; columns reflow
intrinsically without application breakpoint configuration.

NAVIGATION-MENU-001: A named navigation landmark presents keyed top-level links,
actions, labels and bounded groups of child links. This closed contract supports one
submenu level. Arbitrarily recursive trees, raw icons and router-specific props are not
part of this contract. Group labels cannot simultaneously navigate or run an action.
Active links have aria-current=page. Disabled targets cannot execute or navigate. Both
top-level and submenu actions receive exactly zero arguments, per RENDER-015.

NAVIGATION-MENU-002: Base UI owns ephemeral disclosure state, pointer intent, keyboard
navigation, Escape and focus restoration. Horizontal and vertical orientations are
logical preferences; item labels wrap. Submenus use collision-aware, bounded scrolling
and inherit the current template and direction across portals. Navigation remains usable
on narrow screens. No viewport breakpoint or positioning prop is public.

STEPPER-001: A named stepper presents an ordered, keyed list with titles, optional
descriptions and safe content. A required controlled value identifies an enabled step.
The active button has aria-current=step, and only its named content region is shown. The
host owns business validation and state; no transition occurs until it updates value.

STEPPER-002: Linear mode defaults true and permits backward steps and the next enabled
step. Disabled steps are skipped. Nonlinear mode permits any enabled step. Global
disabled mode prevents all changes. Arrow keys follow orientation and scoped direction;
Home/End select the first/last reachable focus target without activating it. Enter/Space
activate a focused step through native buttons. Focus never becomes trapped.

NAV-TRANSPORT-001: JSON remains optional transport. Navigation targets use registered
action names; every nested action is validated before rendering. Footer slots and each
step content use required/optional bounded node arrays, traversed before rendering.
Stepper binds an existing text state key in read or readWrite mode. Initial and later
values must name an enabled declared step. Read bindings display progress without
writes. No new state kind or runtime dependency is introduced.

Acceptance includes strict schema/type rejection, DOM/SSR semantics, meaningful pointer
and keyboard interaction, independent child actions, host-controlled transitions,
generative action/binding validation, state isolation and hydration. Browser scenarios
cover both templates, narrow/wide layouts, scoped RTL, long labels and 200% text. Every
owned executable file needs 100% statements, branches, functions and lines.

Primary references retrieved 2026-10-29 in .cache/navigation-references/:

- https://ui.nuxt.com/docs/components/footer-columns.md
- https://ui.nuxt.com/docs/components/navigation-menu.md
- https://ui.nuxt.com/docs/components/stepper.md
- https://base-ui.com/react/components/navigation-menu

Adaptation is explicit: navigation has one submenu level and safe slots replace Nuxt
icon/class/ui/as callbacks. The React host supplies state rather than Nuxt router
models.
