# State and interactions

STATE-GEN: Generative UI uses explicit state definitions and typed read/read-write
bindings. See `generative-state.md` for keys, permissions, lifecycle, and
DataTable-specific transitions. Local node values are not the new state model.

STATE-001: State is the highest layer in the dependency chain. It composes the selected
adapter and renderer with the application without being imported by lower layers.

STATE-011: Jotai is the state implementation. Use typed atoms, explicit stores, and
controlled bindings. Lower layers must not import application atoms or directly access a
Jotai store.

STATE-002: Business data has explicit owners. Renderers and adapters do not become
hidden stores for form values, navigation state, or business actions.

STATE-003: Bindings are typed and controlled. A field reports a value of its declared
type and receives the next value from its state owner.

STATE-004: Keep adapter selection, template selection, business data, and transient
presentation state distinct. A design change is not a business reset.

## Composition root

The root selects a valid adapter and design template, creates a rendering port, and
provides it to declared components. It also supplies application actions and bindings
where generative UI needs references instead of callbacks.

STATE-005: Invalid adapters, templates, bindings, and unresolved actions produce
diagnostics before interactive content is made available.

STATE-006: Reusable application components compose reacd components with typed Jotai
atoms. The reference application must demonstrate real state updates rather than static
examples dressed as controls.

## Actions

STATE-007: Normal TSX passes typed functions such as `onPress`, `onValueChange`, and
`onSubmit`. JSON passes registered references, not executable expressions.

STATE-008: Action execution receives only declared application values. Removed fields
and prototype properties must not leak into action payloads.

STATE-009: Loading, success, cancellation, and failure behavior must be explicit for
asynchronous operations. Do not imply that a local demonstration wrote to a remote
service.

STATE-010: Validation does not replace authorization. Backend access control and
business rules remain responsibilities of the application and its services.

## Compatibility

STATE-012: Create a store per application instance or SSR request. Never use a
process-wide store for user-specific state. Keep the store above the adapter boundary so
visual implementation changes do not discard business data.

State tests verify store isolation, controlled updates, adapter and template switching,
form submission, disabled actions, navigation, selection, resets, and invalid
references. React hooks must follow normal hook rules; do not call component functions
manually to simulate a declarative API.

## Selection state capacity

STATE-SELECTION-001: Generic selection state accepts unique nonempty opaque string
values up to CONTENT_POLICY.maxLabelLength, retaining STATE_POLICY.maxSelection as
its count limit. This capacity is separate from state-key namespaces and component
membership constraints. Keep DataTable row ID limits, Tree membership and InputTags
target bounds unchanged. Sharing a selection state never bypasses a mounted control's
narrower constraints. No new state kind or registry implementation is required.

## References

- [Jotai](https://jotai.org/)
- [Provider](https://jotai.org/docs/core/provider)
- [Store](https://jotai.org/docs/core/store)
- [Next.js](https://jotai.org/docs/guides/nextjs)
