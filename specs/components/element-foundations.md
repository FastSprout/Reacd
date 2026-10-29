# Element foundation acceptance

ELEMENT-CALLBACK-001: Zero-argument action capabilities receive no browser event or SDK
details. Pointer, Enter and Space activation call onPress() explicitly. Disabled and
loading controls never invoke the action. Alert actions follow the same boundary;
onOpenChange receives only its documented boolean value.

Status: implemented in the isolated Agent B workspace; combined browser and root
acceptance remain separate. Existing Button, Alert, Badge, Card and Progress callers
remain compatible.

## Icon

ICON-001: Provide one closed TSX Icon module with named inferred Props. Names select a
finite semantic map owned by the adapter, never arbitrary icon-package strings, URLs,
SVG markup or render functions. Meaningful icons require a nonempty label. Decorative
mode requires decorative:true and forbids a label. Default logical size is medium, with
small/medium/large sizes mapped through named core policy and template variables. Icons
inherit surrounding foreground color; no public color, stroke or pixel dimensions are
accepted.

ICON-002: Meaningful icons expose role img and their accessible label. Decorative icons
are hidden from accessibility and never focusable. Closed mappings include add, remove,
close, check, search, info, warning, error, success, settings, download, upload and
external and loading. Button/Badge icon names use this same vocabulary and render
decoratively beside their visible label.

## Button

BUTTON-001: Preserve required label and onPress plus optional intent and disabled. Add
optional leadingIcon/trailingIcon names and loading/loadingLabel. Loading renders a
named busy state, prevents pointer/keyboard activation and exposes aria-busy. A
loadingLabel replaces the visible/accessibility label while busy; otherwise preserve the
supplied label. Existing consumers receive unchanged default semantics. Buttons remain
type button and never silently submit surrounding forms.

BUTTON-002: Labels wrap, icons cannot collapse controls, and controls retain minimum
touch targets. Native disabled semantics suppress actions. Test Enter and Space, pointer
activation, loading/disabled guards, long labels, provider isolation and template
changes. No href, asChild, arbitrary child content or native event leaks.

## Badge

BADGE-001: Preserve label and optional intent. Optional leadingIcon and a logical
small/medium/large size are closed design-system choices. Badge remains noninteractive
status content; it cannot receive onClick, href, tabIndex or native HTML props. Its
visible label supplies the text alternative for a decorative icon. Labels wrap inside
their container in every size and supported template.

BADGE-002: Optional 0.2 generative transport accepts a literal Badge with exactly
its existing label/intent/leadingIcon/size contract. It has no state binding or
host action. The same shadcn adapter renders TSX and validated JSON declarations.
The portable schema rejects native props, styling, HTML, child slots and callbacks.

## Card

CARD-001: Preserve children and optional spacing. Add optional accessible label plus
header/footer slots accepting the same validated reacd content as children. The renderer
owns header/body/footer structure and token spacing. A label supplies named region
semantics; an unnamed Card remains a structural surface. Empty slots must not create
unnecessary layout wrappers. Application HTML, CSS and arbitrary renders remain
forbidden in every slot.

CARD-002: Generative Card owns a direct recursive node interface with children and
optional header/footer node arrays. The central recursive union, schema, visitor and
renderer must traverse every slot for action/state validation and rendering. A
generative header/footer cannot become an unvalidated object escape.

## Alert

ALERT-001: Preserve title, message and info/success/warning/error intent. Informational
and success alerts use polite status semantics; warning/error use alert semantics.
Optional open is controlled visibility and defaults to visible. Optional onOpenChange
enables dismissal only when open is explicitly controlled. A custom closeLabel requires
that dismissal callback. Dismissal requests false and never mutates local visibility.
Callback rejection leaves content present.

ALERT-002: Optional closed actions have unique ids, nonempty labels, required onPress,
optional logical intent and disabled. Bound action count through named policy. Actions
and dismissal remain reachable with native buttons and visible focus. Long title,
message and action labels wrap without overlap. Plain strings are always escaped.

ALERT-003: Generative visibility accepts a literal boolean or boolean state binding.
Read bindings preserve visibility without dismissal. ReadWrite bindings may dismiss.
Actions refer only to registered host action keys; validate every reference before
rendering and guard stale/missing handlers. Stores and SSR requests remain isolated.

## Progress

PROGRESS-001: Preserve label and numeric value semantics. Optional/null value means
indeterminate progress. Optional max is finite and positive, default 100, with selected
values constrained inclusively to zero through max. Reject NaN, infinities and values
outside bounds instead of silently clamping. Description is associated with the
progressbar. Optional showValue defaults true, preserving existing numeric percentage
display; indeterminate content reports an explicit working state.

PROGRESS-002: Determinate progress exposes current/max/min values and correct percentage
relative to max. Indeterminate progress omits aria-valuenow. Logical inline fill grows
from the correct side in App RTL and remains confined. Do not require animation to
convey progress; honor reduced motion if any animation is introduced.

PROGRESS-003: Generative literals may be number/null/omitted. Read references accept
number or nullableNumber state and register a max-aware constraint. Renderer/binding
dispatch must distinguish null from a state reference and preserve max/description/
showValue. Shared writes cannot violate another progress reader's bounds.

## Acceptance

ELEMENT-001: Each module has a strict schema, named Props, TSX declaration, trusted
shadcn mapping, consumer type tests, meaningful behavior/failure tests and public
compiled examples. Four-category coverage is 100% per owned executable file. Verify both
templates, 240px through desktop, 200% text, RTL, keyboard, SSR/hydration and
template/state retention in real browsers before accepting the catalog entries.

Primary references checked 2026-10-29:

- https://ui.nuxt.com/docs/components/alert
- https://ui.nuxt.com/docs/components/badge
- https://ui.nuxt.com/docs/components/button
- https://ui.nuxt.com/docs/components/card
- https://ui.nuxt.com/docs/components/icon
- https://ui.nuxt.com/docs/components/progress
- https://ui.shadcn.com/docs/components/base/alert
- https://ui.shadcn.com/docs/components/base/button
- https://ui.shadcn.com/docs/components/base/card
- https://ui.shadcn.com/docs/components/base/progress

The curated contract intentionally excludes arbitrary styling, arbitrary icon names, raw
HTML, vendor slots and native events. It does not claim unbounded upstream API parity.
Existing verified containers and controls remain the compatibility baseline.
