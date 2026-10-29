# AvatarGroup

AVGROUP-001: Provide separate named Props/schema/TSX modules. Require label and bounded
items with unique stable IDs plus the Avatar name/source/fallback contract. Empty lists
are valid and have a visible empty message. Group size applies to every item. Optional
max is a positive bounded integer; the default cap is a named core policy.

AVGROUP-002: Show the first max items and an accurate remaining count when truncated.
Provide a real keyboard-accessible disclosure listing all hidden names/avatars. Its
label must communicate the count. Empty/full/overflow lists remain named and semantic.
Do not silently discard identities or turn a count into an inert button.

AVGROUP-003: Preserve stable item keys and use the same private Avatar adapter. Layout
wraps within its container without overlap/clipped names at narrow widths or enlarged
text. Native disclosure state is transient UI state; business values stay host-owned.

AVGROUP-004: Generative 0.2 validates group properties/items and uses the same adapter.
Changes in host data replace the group coherently. SSR/hydration preserve initial
identities, empty state, and disclosure structure. Theme changes preserve app state.

AVGROUP-005: Require schema/type/failure tests, full per-file coverage, exact adapter
mapping, portable schema, packed-consumer SSR, hydration, compiled docs, and browser
disclosure/containment checks for both profiles, all widths, and 200% text.

References retrieved 2026-10-29:

- https://ui.nuxt.com/docs/components/avatar-group
- https://ui.shadcn.com/docs/components/base/avatar

Nuxt's overflow count becomes an actionable disclosure preserving access to every name.
App native slots, negative spacing, CSS masks, and arbitrary local styling are
replaced by closed items and engine-owned wrapping. Chips/tooltips remain separate.
