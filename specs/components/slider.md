# Slider

Status: enterprise extension under review. Existing single-value callers remain valid.

SLIDER-001: Preserve label, finite value, min, max, optional positive step and the
single-number callback. Add description, logical name, disabled/readOnly, closed
horizontal/vertical orientation and explicit range mode. Default mode is single. Range
mode uses a readonly numberRange DTO {start,end} and matching typed callback. No
arbitrary thumb arrays, native events, CSS, pixel dimensions or render slots.

SLIDER-002: Range DTO endpoints are finite and ordered; equal endpoints are allowed.
Core exports NumberRange and isOrderedNumberRange. Schema exports numberRangeSchema and
boundedNumberRangeSchema({min?,max?}). Limits are inclusive finite bounds. The shared
numberRange state kind validates this DTO without importing Slider or any SDK. A
complete invalid or reversed proposal never reaches the public callback or registry.

SLIDER-003: Slider min is strictly less than max. Both single/range values remain within
the bounds. Step must be positive and affects keyboard/pointer movement; existing finite
controlled values are not silently snapped on render. The host remains responsible for
accepting requested writes. Callbacks receive exactly one logical value.

SLIDER-004: Each thumb has a visible group label and distinct accessible endpoint name.
Use Minimum/Maximum for ranges. Keyboard arrows/Home/End/Page keys respect orientation,
RTL and step. Prevent thumb crossing; do not swap endpoint identities. The theme owns
track geometry, target sizes, tooltips and vertical extent through named policies.
Read-only prevents writes while retaining focus/native values; disabled omits data.

SLIDER-005: Consume FormField metadata and merge associated description/error IDs.
Explicit name overrides the field name, inherited disabled cannot be re-enabled. Native
FormData serializes single name or range name.start/name.end canonically. Generative
single mode binds number; range binds numberRange. Read bindings force readOnly.
Register min/max constraints on shared host writes in both modes.

SLIDER-006: Acceptance includes strict discriminated props/schemas, single backwards
compatibility, ordered range state/factory bounds, keyboard/pointer endpoint behavior,
exact callback arguments, declined writes, readonly/disabled, form serialization, field
metadata, generative transport/isolated SSR and both-template narrow/200%/RTL browser
geometry. Require 100% per-file coverage in all four categories.

Primary reference checked 2026-10-29:

- https://ui.nuxt.com/docs/components/slider

Cosmetic color/size/inverted and arbitrary multiple thumbs are not copied. Two endpoints
cover the semantic minimum/maximum interval without exposing vendor layout primitives.
