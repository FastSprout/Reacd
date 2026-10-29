# InputRating

RATING-001: Provide a dedicated controlled numeric Props/schema/TSX module.
Zero means unrated. Length is one through ten, default five; step is one or
one-half. Values must be in range and on the chosen step grid. Require a visible
label and logical numeric change callback. Reject HTML, styling and native events.

RATING-002: Preserve Nuxt's half steps, length, clearable, hoverable, disabled,
readOnly, required and name behavior. The adapter owns star icons and cosmetics.
Use shadcn's Radix Slider primitive for pointer and keyboard selection, exposing
one accessible slider with named value text. Arrow/Home/End keys edit ratings.
Clearable provides an explicit keyboard-accessible clear action.

RATING-003: Hover previews must not commit state and must reset when the pointer
leaves. Disabled/read-only controls cannot preview or change. A controlled host
may reject writes. A required zero rating blocks native form submission. Native
rating form values are numeric strings, never icon or display markup.

RATING-004: Generative 0.2 binds number state and accepts read/readWrite modes.
Read mode is read-only. Range and step constraints guard initial and host writes.
Stable labels and state remain isolated during SSR/hydration.

RATING-005: Acceptance requires schema, consumer, interaction, binding, required
form, hydration, runnable documentation, both-template browser conformance, and
four-category 100% coverage per production file. Unit tests do not prove layout.

References retrieved 2026-10-29:

- https://ui.nuxt.com/docs/components/input-rating
- https://ui.shadcn.com/docs/components/radix/slider
- https://www.radix-ui.com/primitives/docs/components/slider

Nuxt's icon slots and size/color props become adapter/template choices. Clear
selection uses a labelled button instead of relying on clicking a selected star.
