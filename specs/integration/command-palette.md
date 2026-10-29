# CommandPalette integration

Status: frozen isolated Agent A batch; root combined acceptance remains pending.
Workspace: .cache/workspaces/a-navigation. Frozen copy:
.cache/batches/command-palette/files/ in that workspace. The baseline is the previous
frozen navigation-composition batch plus the original root, not the live parent tree.
Review aggregate.patch and merge changes rather than replacing shared root files.

## Closed API

CommandPaletteProps is inferred from its own commandPaletteSchema. Required props are
label, query, onQueryChange and groups. Groups have key/label/items. Items have globally
unique key, label, optional description/keywords/disabled and href OR onPress.

Optional onSelect(key): boolean|void runs before the captured target. False vetoes it;
invalid runtime return values fail closed with a visible diagnostic. Async callbacks are
not accepted by the public type. No selection modifies the controlled query.

Optional filtering is local|external, status is ready|loading|error, disabled blocks
editing, and emptyMessage/loadingMessage/errorMessage replace visible state copy.
Local matching is normalized all-token text search with exact/prefix label ranking.
This is an explicit adaptation from Nuxt Fuse matching. The adapter uses installed Base
UI Autocomplete inline, not cmdk. It is an inline command primitive, not a dialog or
native navigation menu. ContentSearch and DashboardSearch can compose Modal themselves.

## Integration steps

1. Add CommandPaletteProps and its name to the catalog; re-export its own barrel.
2. Spread commandPaletteEntries into shadcnAdapter.components and add its example.
3. Import command-palette.css and spread commandVariables() into templateVariables.
4. Add commandPaletteNodeSchema to leafNodeSchemas. It is a leaf with static groups;
   no recursive union or visitor change is required.
5. catalogBindings returns a readWrite text query contract and optional selection
   readWrite text contract. commandSelectionSchema accepts empty text or a declared key.
6. nodeActionReferences must traverse groups[].items[].action before rendering.
7. Dispatch CommandPalette to BoundCommandPalette. It constrains query/selection live,
   reports rejected writes, vetoes targets when selection publication fails, and checks
   Object.hasOwn plus typeof before executing registered named actions.
8. Merge the documented example into NavigationExamples and its page into MkDocs.
9. Regenerate the combined generative schema; do not overwrite it with snapshot JSON.

No dependency, state kind, Modal implementation or public generative action context
changed. Queries/selected keys use existing isolated Jotai text state. Parent hosts
retain control over open/onOpenChange and their selection callback semantics.

## Verification

- 24 focused tests across seven files passed. Tests cover schema budgets/global keys,
  deterministic matching, pointer and keyboard activation, IME, controlled query,
  synchronous veto/invalid async return, captured URLs, all status modes,
  no-op prevention,
  nested Modal Escape ownership, transaction refusal/recovery, action mutation safety,
  live binding errors, SSR/hydration and fresh-request isolation.
- All four metrics are 100% for ten executable owned files. Two empty/type-only files
  are separate. Counts: 127 statements, 91 branches, 43 functions and 109 lines.
  Coverage report: .cache/command-coverage/coverage-summary.json.
- Four-project typecheck, source policy and type-aware explicit-path lint passed.
  Lint selected 30 changed TS/TSX paths, without the ancestor .cache ignore ambiguity.
- Twelve Chromium production-preview cases passed: two templates, 240/375/1440 widths,
  scoped LTR/RTL, 200% text, keyword filtering, keyboard execution, pointer veto, long
  queries, external results, visible loading/error and document containment.
- Twelve additional dev cases passed; initial dev prebundling emitted stale chunk
  diagnostics. Production preview verification avoids that optimizer artifact.
- Build and bundle budgets passed, strict MkDocs passed, schema freshness passed.
  Port 5178 servers are stopped. No root inventory entry is marked Verified here.

Root package/combined coverage/browser checks and interaction with concurrent parent
changes remain the integrator's gate. The frozen evidence directory contains exact logs.

## New paths

- demo/e2e/command-palette.spec.ts
- docs/components/command-palette.md
- docs/examples/command-palette.test.tsx
- docs/examples/command-palette.tsx
- specs/components/command-palette.md
- src/adapter/shadcn/command-palette/command-palette.adapter.tsx
- src/adapter/shadcn/command-palette/command-palette.test.tsx
- src/adapter/shadcn/registry/command-palette.ts
- src/components/command-palette/command-palette.props.ts
- src/components/command-palette/command-palette.tsx
- src/components/command-palette/command-palette.types.test.ts
- src/components/command-palette/index.ts
- src/core/command-policy.ts
- src/core/command-search.test.ts
- src/core/command-search.ts
- src/renderer/styles/command-palette.css
- src/renderer/theme/command-variables.test.ts
- src/renderer/theme/command-variables.ts
- src/schema/command-palette/command-palette.schema.ts
- src/schema/command-palette/command-palette.test.ts
- src/schema/command-palette/generative.schema.ts
- src/state/generative-ui/bound-command-palette.tsx
- src/state/generative-ui/command-palette.test.tsx

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
- src/schema/generative-v2/leaf-nodes.schema.ts
- src/state/generative-ui/node-view.tsx
