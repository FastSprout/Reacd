# ColorPicker

Status: implemented with scoped unit, SSR and production browser verification. Agent A
owns final root integration acceptance.

COLOR-001: Provide a closed TSX ColorPicker with explicit rgb/rgba mode, required
label/value/onValueChange and optional description, presets, name, disabled/readOnly.
Values are canonical lowercase #rrggbb or #rrggbbaa matching the selected mode. Presets
are bounded labelled DTOs with unique values matching that same mode. No SDK Color
objects, native event props, CSS or custom renderers are public.

COLOR-002: Implement a real color area, hue slider, alpha slider in rgba mode and
validated hexadecimal entry. Pointer, keyboard and preset interactions request canonical
values. Invalid partial text never escapes as application state. Preserve controlled
host rejection and external value changes. Achromatic hue may remain private interaction
state without accepting a rejected different canonical value. Keep hexadecimal guidance
present while editing. Changing its error semantics on blur must not shift a following
submit control between pointer down and pointer up.

COLOR-003: React Aria Color objects stay inside the trusted adapter. Use narrow official
imports if broader declarations fail exact optional-property checks. Resolve actual App
direction through an explicit private i18n scope. Verify RTL and SSR rather than
assuming locale direction follows a DOM attribute. Default markup is deterministic and
uses no ambient locale, clock or viewport measurement.

COLOR-004: Selected swatch color is business data only. Labels, focus and structural
borders use validated template contrast. Do not color text with an arbitrary selected
value. Thumb treatment must remain visible against any color area value. Controls retain
named layout constraints, touch targets and full text at narrow zoomed widths. Hex
feedback inherits validated text contrast. Danger/onDanger contrast does not imply that
danger text is visible on the surface. Error emphasis must not change text layout.

COLOR-005: Optional name exposes canonical native FormData. ReadOnly retains its value;
disabled omits it. Protected controls cannot emit writes, while readonly text remains
available for reading/copying. Integrate with existing form/field metadata. Private
channel inputs use a deterministic separate form association. Their SDK range steps must
not reject valid fractional channel values in the host form. Only the canonical bridge
and the hexadecimal draft participate in host form validation.

COLOR-006: Optional generative UI uses text state references with read/readWrite access
and the mode-specific bounded canonical value schema. No new state kind is introduced.
Reader bindings force protected interaction. Presets remain literal data; application
and SSR stores stay isolated.

COLOR-007: Acceptance covers strict schemas/types, mode/preset consistency, real area
and hue/alpha/hex interactions, achromatic colors, controlled rejection, external
updates, disabled/readOnly, FormData, field metadata, generative permissions and
SSR/hydration. Verify actual RTL, both profiles, 240/360/768/1440 and 200% text in the
browser. Every owned executable file requires 100% statement/branch/function/line cover.

Primary references: official Nuxt ColorPicker source and React Aria ColorPicker docs.
