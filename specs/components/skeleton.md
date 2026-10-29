# Skeleton

SKELETON-001: Provide a separate closed schema, named Props/function, adapter and
colocated tests. Accept logical text/avatar/rectangle shape, small/medium/large size,
bounded text-line count, optional status label, animated boolean and show boolean.
Reject dimensions, arbitrary tags, native events, styles and child markup. Explicit
lines apply only to text. Named core policies own sizes, line limits and motion.

SKELETON-002: Unlabeled placeholders are decorative and absent from the accessible
tree. A label exposes one polite loading status, never a tab stop. Hidden placeholders
have no visible or accessible footprint. Do not imply actual loading progress.
The status itself must not be permanently aria-busy, which can defer its own message.

SKELETON-003: Shapes reserve intrinsic space, shrink inside narrow containers and
preserve logical orientation. Text lines wrap only as visual blocks. Avatar shape
uses a circle constrained by available width. Motion is optional, finite within five
seconds and disabled by reduced-motion preference. No application CSS is required.

SKELETON-004: Follow the shadcn Skeleton surface recipe using validated design tokens.
Changing template or visibility does not reset host state. Server markup/hydration
is deterministic. Generative 0.2 show accepts a literal or boolean read binding;
invalid keys, kinds, modes and host writes fail closed.

SKELETON-005: Require complete adapter mapping, schema/type/runtime tests, per-file
100% coverage, portable schema, packed TSX/SSR, hydration, compiled docs and browser
checks for both templates, eight widths, RTL, enlarged text and reduced motion.

References retrieved 2026-10-29:

- https://ui.nuxt.com/docs/components/skeleton
- https://ui.shadcn.com/docs/components/base/skeleton

Nuxt's arbitrary class-driven dimensions and tags become bounded semantic shapes.
Skeleton does not accept business content or switch another view's loading state.
