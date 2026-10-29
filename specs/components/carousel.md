# Carousel

Status: approved curated contract before implementation. Full combined acceptance is
separate from component-owned tests.

CAROUSEL-001: Provide a named closed TSX Carousel with required label, controlled
integer value and onValueChange callback. Items are bounded unique-id objects with
nonempty labels and validated reacd children. Empty items require value 0 and render an
explicit empty state without navigation controls. Nonempty values must index an existing
item. Named core policy owns item limits, orientation and defaults.

CAROUSEL-002: Optional orientation is horizontal (default) or vertical. Loop defaults
false. Disabled/readOnly block navigation transitions, not unrelated business actions
inside the active slide. Controls request host changes and never mutate value. A
rejected proposal leaves the same slide active. No forced autoplay or drag behavior is
part of this curated contract.

CAROUSEL-003: Expose a named carousel region and labelled slide groups with ordinal
metadata derived from item data. Previous/Next and slide chooser controls are native
buttons. Boundary controls disable when looping is off. Arrow/Home/End keys work when
the carousel region itself is focused; nested form caret/navigation keys remain native.
Horizontal arrows follow actual App RTL direction. Vertical arrows follow orientation.

CAROUSEL-004: Inactive panels stay mounted to preserve application state, but are hidden
and inert so their controls are absent from focus and accessibility. Do not duplicate
slide content. A disabled trusted fieldset excludes inactive native controls from form
validation and FormData. Inactive panels also deactivate nested portals without cloning
application children or mutating their props. Active-panel form behavior remains native.
A host index update while focus is inside the old slide repairs focus to the named
carousel region. A host update never steals focus already outside the old slide. Capture
pre-mutation focus before hidden-panel updates.

CAROUSEL-005: Support ready/loading/error plus explicit empty content. Loading/error
replace interactive slide controls with named state text. Optional retry action uses a
real typed host callback. Text wraps, active content stays in flow, controls reflow and
retain shared minimum targets in both templates, narrow screens and 200% text. No
animation is required; reduced-motion users receive the same readable slide behavior.
Retry receives zero arguments, never a SyntheticEvent or SDK details.

CAROUSEL-006: Generative transport declares a direct recursive CarouselNode<Child> with
item child arrays. All items are traversed for schema/state/action validation, including
inactive slides. Value binds to number state with read/readWrite access and an
item-count index constraint. Read access forces readonly navigation. Optional
retryAction must be registered. Shared constraints, isolated apps and SSR requests
remain enforced.

CAROUSEL-007: Acceptance covers strict schemas/types, loops/boundaries, orientation/RTL,
pointer/keyboard interaction, nested input keys, host rejection/external updates,
pre-mutation focus repair, retained inactive state, inaccessible inactive controls,
loading/error/empty/retry, SSR/hydration and browser geometry. Every owned executable
file requires 100% statements, branches, functions and lines. Browser acceptance is not
inferred from schema validation.

Primary references: official Nuxt Carousel and shadcn Carousel documentation, and WAI
ARIA carousel pattern. Arbitrary slots/styles, gesture engines and autoplay are not
claimed as upstream parity.
