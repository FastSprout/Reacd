# Content navigation and table of contents

Status: specified for Agent A isolated implementation.

OUTLINE-001: ContentNavigation renders a named semantic navigation list with bounded,
globally unique keyed recursive items. Each leaf has a safe href; branches may combine
an independent link and disclosure. Label, items, expandedKeys/onExpandedKeysChange
are required. Optional currentKey/onCurrentChange, disabled, expansionReadOnly and
emptyLabel describe logical behavior. Native DOM, styling and router objects stay
private.

OUTLINE-002: Expansion is controlled and only existing branch keys are valid. A disabled
branch disables its subtree. Disclosure buttons expose expanded state and content IDs;
closed descendants are hidden from focus and accessibility traversal. Native links
retain context menus, modifier activation and protected new-window behavior. Ordinary
activation first calls onCurrentChange(key); false vetoes navigation. Invalid callback
returns fail closed with visible feedback. No browser event reaches that callback.

OUTLINE-003: ContentToc renders named nested fragment links from semantic keys and plain
labels. Required label/items and optional currentKey/onCurrentChange, disabled and
emptyLabel form its contract. Current state is supplied explicitly by the host. There
is no pretend scrollspy, DOM query or implicit Nuxt Content dependency. Native fragment
activation reaches real page anchors; aria-current=location communicates current state.

OUTLINE-004: Tree size/depth and cycle/identity preflight reuse named TREE_POLICY and
boundedTree before recursive parsing or flattening. Keys use the shared semantic
identifier contract. Current key is empty or an existing item. Expanded keys are unique
and must name branches. Layout and indentation are named core policies, wrap long text,
use logical direction and preserve usable width on deeply nested narrow views.

OUTLINE-005: Optional generative transport uses explicit text current state and
selection
expanded state. Both read and readWrite are supported; read expansion disables
disclosure
without disabling links. Rejected current writes veto navigation and show feedback;
rejected expansion writes leave the controlled tree unchanged and show feedback. All
subsequent writes to shared keys obey mounted item constraints. Stores remain isolated.

Acceptance includes malformed/oversized/deep/cyclic/duplicate structures, hidden focus,
exact logical callbacks, native links and fragment focus, disabled/read-only state,
write veto/recovery, SSR/hydration, compiled Jotai examples, packed consumers and 100%
per-file coverage. Browser conformance uses both templates, 240/320/768/1440 widths,
scoped RTL, 200% text and long labels. Schema acceptance alone proves no browser layout.

References retrieved 2026-10-29:
https://ui.nuxt.com/docs/components/content-navigation and
https://ui.nuxt.com/docs/components/content-toc. reacd uses explicit host data and
current
state instead of Nuxt's CMS/router/scrollspy. Appearance remains adapter-owned;
arbitrary
upstream style/icon slots are not application escape hatches.
