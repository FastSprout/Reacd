# Slider control adaptation

Extends the immutable numberRange foundation and SLIDER-001 through SLIDER-006.

SLIDER-007: Use the installed Base UI Slider in the shadcn adapter. Explicit thumb
indices make server rendering deterministic. Collision behavior is none: minimum and
maximum identities cannot swap or push each other. Read-only remains focusable and
serializes canonical values, but cancels SDK proposals before committing private state.
Disabled prevents interaction and omits canonical entries. A hidden SDK range input has
no application name; only the trusted canonical bridge owns submitted values.

SLIDER-008: Default step is one; Page keys use ten steps, bounded by the total span.
Values need not be aligned to step on initial render. Explicit finite min/max are
required and strictly ordered. The engine uses an explicit en-US locale for consistent
SSR numeric formatting. App direction is bridged to Base UI's DirectionProvider.
Description and FormField errors associate with each visible thumb input.

SLIDER-009: Native ranges always contain finite valid canonical values. Required
metadata adds no empty-state rule because the public contract has no null. Range
serialization uses name.start/name.end; single uses name. Each public callback receives
one number or frozen {start,end}, never SDK arrays/events/details. Invalid SDK values
are canceled and do not reach host state. A declined host write leaves the visible and
submitted controlled values unchanged.

Browser acceptance includes endpoint keyboard identity/collision, RTL, vertical
geometry, pointer editing, native data and both templates at 240/360/768/1440 and
text200%. Unit acceptance exercises malformed SDK proposals independently of pointer
geometry.

Primary references checked 2026-10-29:

- https://base-ui.com/react/components/slider
- https://ui.nuxt.com/docs/components/slider

SLIDER-010: Slider supports numbers exactly representable with at most twelve decimal
fraction digits. Reject excess precision instead of silently rounding canonical values.
The named precision matches the installed range collision implementation; subnormal
values would also exceed Number.toFixed's supported precision. This limitation belongs
to Slider, not the general numberRange state kind.

SLIDER-011: The numeric contract requires a positive finite span, finite span multiplied
by the named percentage scale, and finite span divided by step. Step must be positive
and supported at the same precision. When step is smaller than span, min+step must
advance min and max-step must decrease max in JavaScript number arithmetic. Reject
intervals with dead keyboard increments before mounting native controls. Initial values
retain their exact supported number and are not snapped to a step grid on render.
Editing uses a step grid originating at min; the first edit can align an off-grid value.

SLIDER-012: Primary TSX props, generative node validation, bound host-write schemas and
SDK proposals share the same numeric capability contract. Accept representative decimal
boundary values and reject zero/subnormal steps, unsupported endpoint precision,
overflowing spans/percentages/quotients and unrepresentable increments. Native range
semantic attributes must update with controlled read-only/error changes and remove stale
attributes when the flag clears.

SLIDER-013: The public root entry point re-exports the general NumberRange type so hosts
can type interval atoms and callbacks without private imports. NumberRangeBounds and
isOrderedNumberRange may also be additive root data utilities. Parent owns these barrel
changes and package/type acceptance. These exports do not narrow general numberRange or
move component Props into core.
