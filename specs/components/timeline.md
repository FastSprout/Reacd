# Timeline

TIMELINE-001: A labelled ordered sequence contains uniquely identified events with
required titles, optional date labels, descriptions and disabled state. An optional
value identifies the current event; omission selects the first. An optional
onValueChange requests controlled selection. Every value must reference an item. Intent,
orientation and reverse are closed logical choices. Reject native events, styles,
arbitrary tags, duplicate ids and unknown values.

TIMELINE-002: Render a semantic ordered list. Earlier events are completed, the current
event has aria-current step, and later events are upcoming. Status is visible text,
never color only. Readonly titles have no tab stops. Interactive titles use shadcn
Buttons with keyboard and disabled semantics. Selection only requests a host update.
Reversing display preserves chronological status.

TIMELINE-003: Vertical is default; horizontal uses wrapping intrinsic tracks, preserving
event content and focus at narrow widths and text zoom. Long titles, dates and
descriptions wrap. Templates own colors/spacing. Literal generative nodes share the
schema and support a readWrite text reference for current value. State references are
constrained to existing event identifiers.

TIMELINE-004: Require schema/type failures, defaults and all event states,
selection/disabled/readonly behavior, reverse/orientation/template preservation, state
binding errors/isolation, compiled examples, SSR/hydration and browser geometry.
Coverage is 100% per production file; schema validation alone does not prove rendering
correctness.

TIMELINE-005: The runnable preview exposes explicit App direction. RTL conformance
selects that public context so native layout and primitive providers receive the same
direction; document attributes alone may be overridden by a descendant.

References retrieved 2026-10-29:

- https://ui.nuxt.com/docs/components/timeline
- https://ui.shadcn.com/docs/components/button

This owned shadcn composition supports event selection without exposing Nuxt's arbitrary
item slots, class names, raw events or user-provided icon renderers.
