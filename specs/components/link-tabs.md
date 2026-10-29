# Link and Tabs acceptance

Status: accepted in Agent A's isolated workspace. Combined evidence is recorded in
specs/verification/agent-a-foundations.md.

## Link

LINK-001: Link requires a nonempty label and validated href. Relative application paths,
fragments, HTTP(S) and mailto destinations are supported. Backslashes, control
characters, protocol-relative URLs and executable schemes are rejected.

LINK-002: Optional active marks the current page with aria-current. Optional disabled
keeps the link's visible label and role while removing its destination and keyboard
activation. A disabled link never navigates, including modified clicks. newWindow opens
an enabled destination with noopener and noreferrer. Native browser link operations
remain available; reacd does not intercept navigation or infer application routes.

LINK-003: Appearance, wrapping and focus indication come from the trusted renderer and
template. There is no raw tag, CSS, native event, arbitrary rel or target property.
Generative Link has the same closed content contract without executable callbacks.

## Tabs

TABS-001: Tabs is controlled by a required value and typed change callback. It requires
an accessible label and a nonempty bounded array of uniquely keyed items. Each item has
value, label, optional disabled and optional safe content. Value must identify an
enabled item. Children remain the compatible shared-content fallback.

TABS-002: Items with content use stable keyed panels. Hidden item panels and shared
fallback content propagate logical inactivity to portals and descendants without
requesting controlled state writes. Inactivity combines with the enclosing scope. Hidden
item panels stay mounted and inaccessible so local field state survives changing tabs.
Shared children remain a single mounted panel that follows the selected trigger.
Explicit item content takes precedence over shared children for that item. No hidden
control participates in the tab order or accessibility tree.

TABS-003: Closed orientation horizontal/vertical and activationMode automatic/manual
describe interaction. Defaults are named core policies. Keyboard behavior follows the
ARIA tabs pattern, skips disabled items, supports Home/End and respects scoped RTL.
Manual mode changes focus on arrow keys and changes selection on Enter/Space. Horizontal
controls reflow without fixed height; no application breakpoint is exposed.

TABS-004: Optional generative Tabs uses explicit text state references. readWrite binds
selection to accepted state updates. read renders a read-only tab set: unselected tabs
are disabled and shared state is never mutated. All item and fallback slots participate
in preflight traversal. Unknown actions, invalid selections, incompatible state and
native content are rejected before partial rendering.

TABS-005: Rejected live shared-state writes preserve the selected panel and expose a
diagnostic. A later accepted selection clears that diagnostic. Read-only selection does
not present enabled controls that silently discard writes.

## Acceptance evidence required

- Schema and consumer checks reject unknown props, unsafe URLs, duplicate values,
  disabled selections, empty labels and native content.
- DOM, SSR and hydration verify current/disabled/new-window links; connected tab/panel
  IDs; manual/automatic and vertical keyboard behavior; disabled skipping; preserved
  uncontrolled child state across selection; and read versus readWrite bindings.
- Actual browsers exercise both templates, 240/320/768/1440 widths, 200% text, LTR/RTL,
  focus order, long unbroken labels, state retention and native link navigation.
- All maintained files obey 300 lines, 88 columns and two-space indentation.
- Per-file statements, branches, functions and lines remain 100% covered. Package
  consumer, complete adapter conformance, source policy and strict MkDocs must pass.

## Primary references

- https://ui.nuxt.com/docs/components/link
- https://ui.nuxt.com/docs/components/tabs
- https://www.radix-ui.com/primitives/docs/components/tabs

Retrieved 2026-10-29. Nuxt routing and styling hooks become explicit href/current state
and validated reacd content. This is React adaptation, not a claim of identical vendor
props.
