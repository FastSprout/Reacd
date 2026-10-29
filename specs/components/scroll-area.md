# ScrollArea

SCROLL-AREA-001: Provide a labelled, keyboard-focusable scroll region containing safe
reacd children. Closed orientation selects vertical or horizontal overflow; closed
extent selects small/medium/large policy bounds. Defaults are vertical and medium.
Reject numeric dimensions, raw CSS, native elements and DOM events.

SCROLL-AREA-002: The adapter composes Base UI's ScrollArea primitive according to the
shadcn recipe: Root, Viewport, Content, Scrollbar and Thumb. Native scroll semantics
preserve keyboard, wheel, touch and nested control use. Scrollbars appear only when
overflow exists; logical content layout supports RTL. Vertical content wraps; horizontal
content has bounded intrinsic tracks inside its region. The page must not acquire
horizontal overflow. Focus outlines stay visible.

SCROLL-AREA-003: Bound content belongs to a host Jotai store and survives theme changes.
Generative 0.2 recursively validates children with the same schema. No document
virtualization or arbitrary scrolling APIs are exposed in this contract; bounded
children remain present for assistive technology and SSR.

SCROLL-AREA-004: Require contract/type rejection, both axes and all extents, contained
interactive children, template/SSR/hydration checks and actual browser
scroll/focus/overflow geometry. Per-file runtime coverage is 100%. DOM-less schema tests
do not establish scroll geometry or touch behavior.

SCROLL-AREA-005: The runnable preview exposes explicit App direction. RTL conformance
uses this public boundary; document.dir alone cannot override a nested provider. Native
arrow tests use the actual viewport direction without synthetic scroll mutations.

References retrieved 2026-10-29:

- https://ui.nuxt.com/docs/components/scroll-area
- https://ui.shadcn.com/docs/components/scroll-area
- https://base-ui.com/react/components/scroll-area

Nuxt's virtualizer, arbitrary dimensions and direct DOM handles stay outside this closed
component contract. This is an explicit supported-subset decision.
