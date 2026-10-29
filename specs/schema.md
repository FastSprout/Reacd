# Schema and validation

SCHEMA-001: Public component properties have runtime schemas derived from the same core
contract used by TypeScript declarations.

SCHEMA-002: Object schemas are closed. Unknown properties produce a diagnostic; they are
not stripped or silently forwarded to a vendor component.

SCHEMA-003: Reject `style`, `className`, `css`, `sx`, `asChild`, arbitrary `as` or
`component` tags, raw HTML, arbitrary DOM attributes, and vendor slot props.

SCHEMA-004: Validate semantic relationships as well as individual fields. This includes
unique option values, valid selected items, valid numeric ranges, matching table rows
and columns, and registered action identifiers.

## TSX declarations

React elements are not serialized to JSON to render normal applications. Callbacks and
controlled bindings remain ordinary typed application functions.

SCHEMA-005: TSX components validate their properties before dispatching to the renderer.
Untrusted JavaScript consumers receive the same rejection rules.

SCHEMA-006: Child validation accepts declared compositions and normal conditional React
content. It rejects direct native HTML elements and malformed child data. Traversal has
a named depth budget and handles cyclic input safely.

## Generative UI

SCHEMA-007: JSON is an optional, versioned input format for the component system. It is
not a separate widget framework with different behavior or styling rules.

SCHEMA-008: JSON contains component kinds, business data, logical intent, binding
references, and action identifiers. It contains no executable code or styling
instructions.

SCHEMA-009: Validate input size and shape before recursive rendering. Report invalid
syntax, excessive resource use, unsupported versions, unknown components, invalid data
relationships, and unresolved action references.

SCHEMA-010: Generated JSON Schema is checked for drift. Relations that JSON Schema
cannot express remain explicit semantic validation requirements.

## Design inputs

SCHEMA-011: Validate design tokens independently from application declarations. Tokens
have documented units, allowed ranges, contrast requirements, and defaults. They cannot
introduce arbitrary CSS or override layout invariants.

SCHEMA-012: A schema validates declarations and data, not all possible rendered pixels.
Documentation must not claim otherwise.
