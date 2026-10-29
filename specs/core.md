# Core policies

CORE-001: Core owns the vocabulary and behavioral constraints. Other layers consume
these definitions instead of independently inventing defaults.

CORE-002: Core has no runtime dependency on schemas, components, renderers, adapters,
browser globals, or application state. React types may describe the rendering port
without introducing DOM implementation code.

## Named values

CORE-003: Behavioral limits, default selections, layout thresholds, text limits, touch
targets, supported variants, and resource budgets have named definitions. No unexplained
literals may control product behavior inside components.

Examples include the default spacing token, supported grid bounds, minimum control
target, text length budget, compact preview width, and schema version.

CORE-004: A named policy records its purpose, unit, and validation boundary. Policy
names describe intent rather than repeating an arbitrary number.

CORE-005: Business content, enum discriminants, ordinary loop indices, and test fixtures
are not unnamed visual policies. Design values belong to a named template or adapter
token definition, not local application styles.

## Type contracts

CORE-006: Core does not own individual component props. Each component exports its own
closed Props type, derived from its corresponding schema. Props do not extend DOM
attributes or accept arbitrary properties through index signatures.

CORE-007: Rendering ports are generic over a catalog supplied by a higher layer. They
preserve the relationship between a catalog key and its properties without knowing any
concrete component's Props. They do not erase properties to `any`.

CORE-008: Action and binding types describe application data. They do not expose browser
event objects as the primary application API.

CORE-009: Validation failures use structured issues with stable codes, paths, and
English messages. Invalid declarations must not silently disappear.

## Policy changes

Changing a behavioral policy requires an updated specification, boundary tests, and
adapter conformance checks. A template may select appearance tokens but cannot relax the
core's safety and accessibility obligations.
