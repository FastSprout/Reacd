# Implementation sequence

This sequence records the locally accepted 150-component enterprise implementation,
including all 132 pinned reference entries. Complete combined gates and independent
reviews are recorded in [combined acceptance](verification/combined-final.md).

## Phase 0: specifications and documentation

- [x] Record the primary TSX authoring model.
- [x] Record the exact six-layer dependency direction.
- [x] Record shadcn/ui as the first adapter and MUI as later work.
- [x] Record source, typing, testing, and local-only constraints.
- [x] Build the MkDocs site in strict mode.
- [x] Serve the MkDocs site locally.
- [x] Include strict MkDocs acceptance in the main check and CI configuration.
- [x] Compile the catalog's colocated documentation preview examples.
- [x] Compile every runnable example across all public documentation pages.

## Phase 1: core and schema

- [x] Introduce the six layer directories and dependency checks.
- [x] Define named limits, defaults, tokens, errors, and abstract ports in core.
- [x] Define closed property types without DOM inheritance or index escapes.
- [x] Implement schemas and semantic validation with focused acceptance tests.
- [x] Keep generative transport separate from application authoring.

## Phase 2: component declarations

- [x] Move every public component into a separate module.
- [x] Expose only logical props, typed values, bindings, and actions.
- [x] Reject native elements and styling escapes in application sources.
- [x] Add the closed JSX runtime and negative compilation fixtures.
- [x] Verify positive and negative consumer type assertions.
- [x] Cover every current declaration module and invalid-property paths.

## Phase 3: renderer

- [x] Separate each rendering implementation into its own module.
- [x] Implement the adapter-facing renderer contract without adapter imports.
- [x] Centralize text containment, layout behavior, and accessibility.
- [x] Verify narrow, wide, nested, long-content, and zoomed-text scenarios.
- [x] Verify current controls' keyboard and error states under the same contract.

## Phase 4: shadcn/ui adapter

- [x] Integrate official sources with provenance and license attribution.
- [x] Implement the entire current declared catalog mapping.
- [x] Keep vendor imports and styling inside the adapter boundary.
- [x] Supply spacious and compact appearance templates.
- [x] Pass the shared adapter conformance suite.

## Phase 5: state and reference application

- [x] Compose the renderer, adapter, bindings, and actions in the state layer.
- [x] Use isolated Jotai stores and verify SSR/request isolation.
- [x] Preserve business state across design changes.
- [x] Replace the HTML-based laboratory with a component-only TSX application.
- [x] Make the working component catalog the main view.
- [x] Keep the JSON editor as a separate generative UI view.
- [x] Load demo families/playground on demand above stable Jotai application state.
- [x] Implement typed generative state, permissions, and atomic table transitions.
- [x] Verify current reference application controls and failure paths.

## Phase 6: enterprise acceptance

- [x] Enforce the 300-line, 88-column, two-space, English source policy.
- [x] Pass current architecture and application-boundary checks.
- [x] Pass strict types, lint, and per-file 100% coverage.
- [x] Include all CLI entry points in coverage with Node behavior/failure tests.
- [x] Verify built exports, SSR, hydration, and adapter conformance.
- [x] Verify packed exports, strict consumer TSX, and negative compile fixtures.
- [x] Build MkDocs in strict mode through the persistent main check.
- [x] Enforce production chunk budgets and deferred-view manifest acceptance.
- [x] Verify every required component reference and runnable documentation example.
- [x] Record requirement-by-requirement evidence locally.
- [x] Confirm no commit, push, publication, deployment, or DNS change occurred.

## Local verification resources

Run unit/coverage files in at most four workers. The full enterprise catalog must
not launch one JSDOM environment per available CPU at once on the shared workstation.
Keep assertion timeouts, coverage thresholds and test scope unchanged; bound execution
concurrency rather than retrying failures automatically.

BROWSER-EXECUTION-001: Local browser acceptance defaults to two workers through a
named execution policy. The four-worker full diagnostic caused actual connection
resets in the local static documentation server. Every discovered scenario remains
mandatory with unchanged assertions, zero retries and unchanged timeouts. Higher
capacity CI/CLI hosts may explicitly opt into more workers after proving serving
capacity. This is resource coordination, not a reduced correctness gate.
