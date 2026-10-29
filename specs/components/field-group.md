# FieldGroup

Status: specified for Agent B implementation; root acceptance is separate.

FIELDGROUP-001: A dedicated TSX module groups related controls under a required
accessible label. Its only layout choice is horizontal or vertical orientation.
Horizontal is the named default and wraps automatically when content cannot fit.
Children use the closed reacd declaration contract. No native elements, styles, classes,
arbitrary renderers or event handlers enter the public group API.

FIELDGROUP-002: The trusted shadcn composition exposes a named group and preserves each
child's label, form participation, tab sequence and controlled callbacks. It never
clones children, rewrites their props or assumes that all children share a value.
Disabled and readonly states are explicit on the individual controls.

FIELDGROUP-003: Use existing template surface, border, radius and spacing tokens.
Maintain shared minimum control targets and visible focus. Long labels wrap; horizontal
groups may become multiple rows without hiding controls or overflowing the page.
Vertical groups remain stacked. App direction controls logical ordering.

FIELDGROUP-004: Generative transport supplies the same label/orientation and bounded
recursive children. Nested bindings and registered actions are validated by the normal
visitor. FieldGroup itself adds no state kind or write capability.

FIELDGROUP-005: Acceptance includes invalid props/native children, missing label, closed
consumer types, both orientations, child keyboard transitions and host updates,
recursive transport validation, independent stores and SSR/hydration. Browser checks
cover both templates, narrow screens, 200% text, RTL and visible control geometry. All
owned runtime files require 100% coverage in all four metrics.

References checked 2026-10-29:

- https://ui.nuxt.com/docs/components/field-group
- https://ui.shadcn.com/docs/components/base/button-group

React adaptation: semantic labelled grouping and automatic wrapping replace arbitrary
slots, CSS class overrides and an unbreakable joined-control row. The group does not
forward size or disabled props invisibly to children. These remain explicit contracts.
