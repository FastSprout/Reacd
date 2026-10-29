# Action menus integration ledger

Status: frozen Agent A Navigation/Overlay batch; root acceptance is pending.
Source workspace: `.cache/workspaces/a-navigation`.
Freeze: `.cache/batches/action-menus/files/` with exact manifests and SHA-256 hashes.

## Ownership and acceptance

This batch implements ContextMenu and DropdownMenu only. It follows
ACTION-MENU-001 through ACTION-MENU-005 and MENU-TRANSPORT-001 in
specs/components/action-menus.md. Earlier frozen Navigation, CommandPalette and
edge-panel batches are prerequisites. Existing Modal, Popover and Tooltip are unchanged.

Each public function has its own schema-derived named Props and explicit ReactNode
return. Items form a strict action/link/checkbox/radio/label/separator/submenu union.
Native event handlers, render functions and CSS remain private. Submenus have one
bounded leaf level. Keys are globally unique and all collection budgets are named.

Actions and choice callbacks are synchronous boolean|void. False vetoes a change;
invalid runtime returns show a diagnostic without closing. Native links preserve href,
new-window and modifier behavior; disabled links omit navigation targets. Checkbox and
radio choices stay open unless closeOnSelect explicitly requests closure.

## Shared integration proposals

Merge aggregate.patch deliberately; do not replace root aggregate files wholesale.
The patch is relative to the latest frozen edge-panels, command-palette and navigation
versions available for each path. The docs index baseline removes this batch's
paragraph.

- Add both named Props/components to components/index.ts and ComponentCatalog/NAMES.
  Root index.ts already exports that barrel and needs no additional export.
- Spread actionMenuEntries into the shadcn registry and extend exhaustive examples.
- Add actionMenuVariables to templateVariables and import action-menus.css.
- Add DropdownMenu as a generative leaf. List ContextMenuNode directly in the recursive
  GenerativeNode union and instantiate its schema with the recursive content schema.
- Route both nodes through BoundActionMenu. Context children use the existing visitor.
- Add menuItemActions to action-reference collection, including submenu action paths.
- Add open plus menuItemBindings to catalog bindings. Choices reuse boolean/text kinds
  and read/readWrite modes; there is no new state kind or action context.
- Regenerate schema/generative.schema.json after root merging.
- Mount both compiled examples in NavigationExamples and add public docs navigation.

The dynamic menu binding atom resolves all item values from the isolated registry store.
Live leases constrain radio values to declared options. Read bindings disable editing;
failed writes leave the current selection and menu intact. Lease-registration failures
produce diagnostics instead of exposing unconstrained choices. Actions recheck own
callable handlers at activation, so deleted/inherited/replaced handlers cannot execute.

## Verification evidence

- 38 scoped tests across 14 files passed. All 25 executable owned files have 100%
  statements, branches, functions and lines; four empty/type-only files are listed by
  the coverage tool. Tests and shared test-support fixtures are not runtime sources.
- Coverage totals: 226 statements, 145 branches, 67 functions and 198 lines.
- 13 production Chromium scenarios passed on port 5178. The matrix covers both themes,
  240/375/1440px, LTR/RTL and 200% root text scale. It checks real submenu clicks,
  choice updates, collision bounds, right-click, keyboard context gestures and focus.
- A separate touch-enabled context uses native CDP long-press input and the configured
  base URL. No browser test hardcodes the worker's port.
- Browser conformance found that macOS Chromium did not synthesize contextmenu for
  Shift+F10 on Base UI's focusable trigger. The trusted keyboard bridge now dispatches
  an anchored native event for ContextMenu/Shift+F10; consumer props stay closed.
- Four strict TypeScript projects, source policy, explicit type-aware lint of 56 changed
  TS/TSX files, strict MkDocs, schema freshness, build and bundle gates passed.
- Source limits: at most 300 lines, 88 columns, two-space indentation. Generated schema
  artifacts retain the repository's established generated format.
- Root package, combined coverage/browser checks and catalog acceptance remain pending.
  Schema validity is not evidence of browser rendering correctness.

Official Nuxt references are cached in .cache/navigation-references/context-menu.md
and dropdown-menu.md. The installed Base UI 1.9.0 menu/context-menu source and official
reference API informed the closed adapter. No dependency was installed or changed.

## New paths

- demo/e2e/action-menus.spec.ts
- docs/components/context-menu.md
- docs/components/dropdown-menu.md
- docs/examples/action-menus.test.tsx
- docs/examples/context-menu.tsx
- docs/examples/dropdown-menu.tsx
- specs/components/action-menus.md
- specs/integration/action-menus.md
- src/adapter/shadcn/action-menu/action-menus.test.tsx
- src/adapter/shadcn/action-menu/decisions.test.tsx
- src/adapter/shadcn/action-menu/menu-content.tsx
- src/adapter/shadcn/action-menu/menu-items.tsx
- src/adapter/shadcn/action-menu/menu-surface.tsx
- src/adapter/shadcn/action-menu/use-menu-frame.test.tsx
- src/adapter/shadcn/action-menu/use-menu-frame.ts
- src/adapter/shadcn/context-menu/context-menu.adapter.tsx
- src/adapter/shadcn/context-menu/keyboard-trigger.ts
- src/adapter/shadcn/dropdown-menu/dropdown-menu.adapter.tsx
- src/adapter/shadcn/registry/action-menus.ts
- src/components/context-menu/context-menu.props.ts
- src/components/context-menu/context-menu.tsx
- src/components/context-menu/context-menu.types.test.ts
- src/components/context-menu/index.ts
- src/components/dropdown-menu/dropdown-menu.props.ts
- src/components/dropdown-menu/dropdown-menu.tsx
- src/components/dropdown-menu/dropdown-menu.types.test.ts
- src/components/dropdown-menu/index.ts
- src/core/action-menu-policy.test.ts
- src/core/action-menu-policy.ts
- src/renderer/styles/action-menus.css
- src/renderer/theme/action-menu-variables.test.ts
- src/renderer/theme/action-menu-variables.ts
- src/schema/action-menu/bindings.ts
- src/schema/action-menu/generative.schema.ts
- src/schema/action-menu/items.schema.ts
- src/schema/action-menu/items.test.ts
- src/schema/action-menu/root.schema.ts
- src/schema/context-menu/context-menu.schema.ts
- src/schema/context-menu/context-menu.test.tsx
- src/schema/context-menu/generative.schema.ts
- src/schema/dropdown-menu/dropdown-menu.schema.ts
- src/schema/dropdown-menu/dropdown-menu.test.ts
- src/schema/dropdown-menu/generative.schema.ts
- src/state/generative-ui/action-menu.test.tsx
- src/state/generative-ui/action-menu/resolve-items.test.ts
- src/state/generative-ui/action-menu/resolve-items.ts
- src/state/generative-ui/action-menu/use-menu-items.test.ts
- src/state/generative-ui/action-menu/use-menu-items.ts
- src/state/generative-ui/bound-action-menu.tsx
- test-support/action-menu-example.tsx

## Modified shared paths

- demo/catalog/navigation-examples.tsx
- docs/components/index.md
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
