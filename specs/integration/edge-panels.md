# Edge panels integration

Status: frozen isolated Agent A batch; root acceptance remains pending.
Workspace: .cache/workspaces/a-navigation. Frozen copy:
.cache/batches/edge-panels/files/ in that workspace. Aggregate patch baseline is the
previous frozen CommandPalette/navigation-composition batches plus the original root.
Review shared modifications instead of replacing parent-owned aggregates.

## Public contract

Drawer and Slideover each have their own module, strict schema, inferred named Props
and schema tests. Both extend the current Modal logical fields and add optional
placement top|bottom|start|end. Drawer defaults bottom, Slideover defaults end.
Drawer additionally has a decorative handle flag, default true. There is no raw snap
point, dimension, CSS, native event, vendor render function or DOM prop escape.

Drawer uses installed Base UI Drawer with native swipe behavior. Slideover uses Dialog
sheet behavior and has no swipe API. Start/end resolve from scoped direction; portal
DOM also inherits that direction explicitly. Existing verified Modal source remains
untouched.
No dependency, state kind or public action context changed.

## Merge steps

1. Add named Props and component names to the catalog; re-export their own barrels.
2. Add edgePanelEntries to the shadcn registry and two exhaustive catalog examples.
3. Import edge-panels.css and spread panelVariables() into templateVariables.
4. Add DrawerNode<GenerativeNode>/SlideoverNode<GenerativeNode> as direct recursive
   union members and register drawerNodeSchema/slideoverNodeSchema factories.
5. Visit each footer slot as well as ordinary children, preserving action preflight.
6. catalogBindings returns an existing readWrite boolean open contract for both nodes.
7. Dispatch both types to BoundEdgePanel. It reports rejected writes outside closed
   panels and inside open panels so the diagnostic remains accessible during refusal.
8. Merge examples into NavigationExamples and references into MkDocs. Regenerate the
   integrated generative schema instead of copying the frozen generated JSON wholesale.

The private usePanelFrame hook owns inherited template/direction, inactive-ancestor
handling and nested Escape scope. Its change callback is a closure, not an unbound
object method. Destructured host/setHost state avoids React ref-taint diagnostics.

## Verification

- 33 focused tests across ten files passed. Schema tests are colocated per component.
- All four coverage metrics are 100% for 15 executable owned files; four empty/type-only
  files are separate. Counts: 86 statements, 71 branches, 19 functions, 83 lines.
  Report: .cache/panels-coverage/coverage-summary.json.
- Tests cover safe props/slots, trigger focus return, child Escape order, registered
  Escape dispatch, locked close refusal, host-controlled refusal, nonmodal/fullscreen,
  retained inactive descendants, handle visibility, Jotai state, failed open/close
  transactions with visible diagnostics, live binding errors, SSR and hydration.
- Fourteen production Chromium scenarios passed. Twelve cases cover both templates,
  240/375/1440 widths, scoped LTR/RTL and 200% text. Each case exercises all four edges
  for both components, dialog naming/direction, geometry, retained fields and keyboard.
- Two gesture cases verify actual mouse drag and native touch swipe, plus keyboard
  close as an alternative. Touch input uses a separate touch-enabled Chromium context
  and CDP Input.dispatchTouchEvent, using the configured base URL.
- Gesture verification exposed an actual bug: Base UI excludes Drawer.Content
  from pointer swipes. The 44px grip is outside that boundary, while editable
  form content remains protected. No clipping mask was introduced.
- Type-aware lint explicitly selected 39 changed TS/TSX files and passed. Four-project
  typecheck, policy, schema freshness, strict MkDocs, build and bundle checks passed.
- Browser port 5178 servers are stopped. Root inventory status was not changed here.
  Combined package/coverage/browser acceptance remains the integrator's responsibility.

Primary Nuxt references are cached in .cache/navigation-references/drawer.md and
slideover.md. Base UI Drawer and shadcn Drawer/Sheet documentation were checked against
installed Base UI 1.9.0. The Base UI versus Vaul adaptation is explicit in public docs.

## New paths

- demo/e2e/edge-panels.spec.ts
- docs/components/drawer.md
- docs/components/slideover.md
- docs/examples/drawer.tsx
- docs/examples/edge-panels.test.tsx
- docs/examples/slideover.tsx
- specs/components/edge-panels.md
- src/adapter/shadcn/drawer/drawer.adapter.tsx
- src/adapter/shadcn/panel/edge-panels.test.tsx
- src/adapter/shadcn/panel/use-panel-frame.test.tsx
- src/adapter/shadcn/panel/use-panel-frame.ts
- src/adapter/shadcn/registry/edge-panels.ts
- src/adapter/shadcn/slideover/slideover.adapter.tsx
- src/components/drawer/drawer.props.ts
- src/components/drawer/drawer.tsx
- src/components/drawer/drawer.types.test.ts
- src/components/drawer/index.ts
- src/components/slideover/index.ts
- src/components/slideover/slideover.props.ts
- src/components/slideover/slideover.tsx
- src/components/slideover/slideover.types.test.ts
- src/core/panel-policy.test.ts
- src/core/panel-policy.ts
- src/renderer/styles/edge-panels.css
- src/renderer/theme/panel-variables.test.ts
- src/renderer/theme/panel-variables.ts
- src/schema/drawer/drawer.schema.ts
- src/schema/drawer/drawer.test.tsx
- src/schema/drawer/generative.schema.ts
- src/schema/slideover/generative.schema.ts
- src/schema/slideover/slideover.schema.ts
- src/schema/slideover/slideover.test.tsx
- src/state/generative-ui/bound-edge-panel.tsx
- src/state/generative-ui/edge-panels.test.tsx

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
- src/schema/generative-v2/catalog-bindings.ts
- src/schema/generative-v2/document.schema.ts
- src/state/generative-ui/node-view.tsx
