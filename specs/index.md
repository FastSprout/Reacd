# Specifications

Status: locally accepted enterprise implementation contract.

These specifications define the TSX-first enterprise architecture. The complete pinned
132-entry inventory and 150-component shadcn catalog pass the combined local gates.
Independent Standards and Spec reviews are closed. Exact source and verification
boundaries are recorded in [combined acceptance](verification/combined-final.md).

Component contract headers retain their original authoring and delivery context.
Current acceptance is authoritative in catalog/nuxt-ui.md and the combined ledger;
planned future scope such as MUI is not included.

## Product contract

Applications declare their complete interface in TSX using reacd components. Application
authors do not write native HTML, CSS, Tailwind classes, inline styles, DOM mutations,
breakpoints, or design-system-specific controls.

React supplies reactivity. reacd supplies the closed component vocabulary, validated
properties, layout behavior, rendering contracts, and state boundary. A theme adapter
supplies the concrete design system. shadcn/ui is the first adapter. JSON is an optional
generative UI transport, not the primary authoring interface.

## Reading order

1. [Architecture and boundaries](architecture.md)
2. [Core policies](core.md)
3. [Schema and validation](schema.md)
4. [Components and TSX](components.md)
5. [Renderer behavior](renderer.md)
6. [Theme adapters](adapters.md)
7. [State and interactions](state.md)
8. [Generative state and table transitions](generative-state.md)
9. [Quality gates](quality.md)
10. [Documentation contract](documentation.md)
11. [Implementation sequence](implementation.md)
12. [CLI runner acceptance](tooling.md)
13. [Parallel catalog ownership](parallel-catalog.md)

## Spec-driven workflow

1. Identify the affected requirement IDs before changing behavior.
2. Update the contract, examples, and architectural decisions first.
3. Write acceptance tests that can fail for the specified behavior.
4. Implement in dependency order, starting with the lowest affected layer.
5. Run the complete local quality gates.
6. Record internal evidence without treating intent as proof.
7. Update product documentation and the internal implementation status.

A specification is not an implementation claim. A passing coverage percentage does not
prove that all behaviors or browser combinations have been tested.

## Local-only operation

LOCAL-001: Work stays in this local working tree.

LOCAL-002: Do not commit, push, publish packages, deploy websites, create remote
branches, or change DNS without a new explicit instruction.

LOCAL-003: `https://reacd.dev/` is the documentation's configured canonical URL. Its
configuration does not imply that the domain has been registered, changed, or deployed.
Local preview uses loopback networking.

## Authority

The user's explicit instructions take precedence. When specifications conflict, resolve
the conflict in the specifications before implementing another behavior. Do not silently
replace the product with a JSON editor, an untyped component registry, or a collection
of visual wrappers.
