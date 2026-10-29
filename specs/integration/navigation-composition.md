# Navigation composition integration

Status: frozen isolated Agent A batch, not root-accepted.
Workspace: .cache/workspaces/a-navigation.
Frozen copy: .cache/batches/navigation-composition/files/ in that workspace.
New and modified path manifests are alongside files/. Aggregate proposals are in
aggregate.patch; review and merge those deliberately, never overwrite root aggregates.

## Exported contract

FooterColumns/FooterColumnsProps, NavigationMenu/NavigationMenuProps and
Stepper/StepperProps each live in their own component module and schema. The
navigationCompositionEntries registry supplies three exhaustive shadcn entries.
No dependency, state kind or vendor installation was added.

- FooterColumns: label, keyed columns of safe targets, optional safe left/right slots.
- NavigationMenu: label, keyed items, one bounded submenu level, orientation. Direct
  targets use href or onPress. Descriptions are group-only. Base UI owns ephemeral
  disclosure state. Portals inherit template, direction and the parent layer host.
- Stepper: label, keyed items, controlled value/onValueChange, linear, disabled and
  orientation. Item content is safe reacd content. Linear mode skips disabled steps
  and permits back/current/next enabled steps. Host refusal preserves current value.

## Aggregate changes

1. Register the three named Props in ComponentCatalog and COMPONENT_NAMES, and re-export
   their own barrels from components/index.ts. Add three CATALOG_EXAMPLES.
2. Spread navigationCompositionEntries into shadcnAdapter.components.
3. Import navigation-composition.css in renderer/styles.css and spread
   navigationCompositionVariables() into templateVariables.
4. Add NavigationMenu to leafNodeSchemas. FooterColumnsNode<GenerativeNode> and
   StepperNode<GenerativeNode> must be direct recursive union members. Add each generic
   factory to the lazy schema. Do not use an intermediate recursive union alias.
5. Visit FooterColumns.left/right and Stepper.items[].content. The central action
   extractor must include every column target and every top-level/child menu target.
6. Stepper catalogBindings uses existing text state and stepperValueSchema(items) with
   the binding mode. Initial and live values must name an enabled declared step.
7. Dispatch the three new nodes to their own generative wrappers. BoundStepper reports
   rejected writes, disables read bindings and preserves shared transaction constraints.
8. Mount the three examples in NavigationExamples and add their MkDocs reference pages.
   Merge with any concurrent Link/Tabs examples instead of replacing their mounts.
9. Regenerate schema/generative.schema.json after integration. The frozen generated
   JSON is evidence for this snapshot; do not overwrite the integrated root schema.

## Verification

- 28 focused tests across 11 files passed, including nested modal Escape ordering,
  controlled refusal, scoped RTL keys, disabled targets, read-only/live binding errors,
  shared transaction refusal/recovery, nested action preflight and SSR/hydration.
- All four coverage metrics are 100% for 25 executable owned files. Six empty/type-only
  files are reported separately. Counts: 140 statements, 117 branches, 54 functions,
  127 lines. Report: .cache/navigation-coverage/coverage-summary.json.
- Four-project npm run typecheck passed. Source policy passed. Explicit-path lint
  selected 54 changed TS/TSX files and passed with type-aware checks and deny-warnings.
- Sixteen actual Chromium scenarios passed: two templates, 240/375/1440 widths,
  LTR/RTL, 200% text, plus long unbroken group labels in all template/direction pairs.
- Browser checks exercised popup geometry, disabled actions, Escape return, Jotai
  retained fields, linear transitions and direction-aware keyboard focus.
- Long labels exposed a real portal padding/content-width overflow, corrected with
  scoped positioner padding and maximum content sizing. No clipping mask was added.
- Library/demo build and bundle budgets passed. Strict MkDocs passed. Schema generation
  and freshness were run in this snapshot. Browser port 5178 servers are stopped.
- A concurrent build temporarily exhausted the default unit-test timeout. A subsequent
  focused rerun after builds finished passed all 28 tests at the unchanged timeout.
- Root combined coverage/package/browser acceptance remains the integrator's duty.
  This batch does not change root inventory status or claim full upstream API parity.

Primary Nuxt references are frozen in .cache/navigation-references/ and use the official
/docs/components/footer-columns.md, navigation-menu.md and stepper.md URLs. Base UI
NavigationMenu API was checked against the installed 1.9.0 package and official docs.

## New paths

- demo/e2e/navigation-composition.spec.ts
- docs/components/footer-columns.md
- docs/components/navigation-menu.md
- docs/components/stepper.md
- docs/examples/footer-columns.tsx
- docs/examples/navigation-composition.test.tsx
- docs/examples/navigation-menu.tsx
- docs/examples/stepper.tsx
- specs/components/navigation-composition.md
- src/adapter/shadcn/footer-columns/footer-columns.adapter.tsx
- src/adapter/shadcn/footer-columns/footer-columns.test.tsx
- src/adapter/shadcn/navigation-menu/menu-target.tsx
- src/adapter/shadcn/navigation-menu/navigation-menu.adapter.tsx
- src/adapter/shadcn/navigation-menu/navigation-menu.test.tsx
- src/adapter/shadcn/registry/navigation-composition.ts
- src/adapter/shadcn/stepper/stepper.adapter.tsx
- src/adapter/shadcn/stepper/stepper.test.tsx
- src/components/footer-columns/footer-columns.props.ts
- src/components/footer-columns/footer-columns.tsx
- src/components/footer-columns/footer-columns.types.test.ts
- src/components/footer-columns/index.ts
- src/components/navigation-menu/index.ts
- src/components/navigation-menu/navigation-menu.props.ts
- src/components/navigation-menu/navigation-menu.tsx
- src/components/navigation-menu/navigation-menu.types.test.ts
- src/components/stepper/index.ts
- src/components/stepper/stepper.props.ts
- src/components/stepper/stepper.tsx
- src/components/stepper/stepper.types.test.ts
- src/core/navigation-composition-policy.ts
- src/core/stepper-navigation.test.ts
- src/core/stepper-navigation.ts
- src/renderer/styles/navigation-composition.css
- src/renderer/theme/navigation-composition-variables.test.ts
- src/renderer/theme/navigation-composition-variables.ts
- src/schema/footer-columns/footer-columns.schema.ts
- src/schema/footer-columns/generative.schema.ts
- src/schema/navigation-composition.test.tsx
- src/schema/navigation-menu/generative.schema.ts
- src/schema/navigation-menu/navigation-menu.schema.ts
- src/schema/navigation-shared/target.schema.ts
- src/schema/stepper/generative.schema.ts
- src/schema/stepper/stepper.schema.ts
- src/state/generative-ui/bound-stepper.tsx
- src/state/generative-ui/generative-footer-columns.tsx
- src/state/generative-ui/generative-navigation-menu.tsx
- src/state/generative-ui/generative-navigation-target.ts
- src/state/generative-ui/navigation-composition.test.tsx

## Modified shared paths

- demo/catalog/navigation-examples.tsx
- mkdocs.yml
- schema/generative.schema.json
- src/adapter/shadcn/__tests__/catalog-examples.tsx
- src/adapter/shadcn/shadcn.adapter.ts
- src/components/catalog.ts
- src/components/index.ts
- src/renderer/styles.css
- src/renderer/theme/template-variables.ts
- src/schema/generative-v2/action-references.ts
- src/schema/generative-v2/catalog-bindings.ts
- src/schema/generative-v2/document.schema.ts
- src/schema/generative-v2/leaf-nodes.schema.ts
- src/state/generative-ui/node-view.tsx
