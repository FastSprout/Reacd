# Toast integration ledger

Status: frozen Agent A Overlay batch; root acceptance is pending.
Source workspace: `.cache/workspaces/a-navigation`.
Freeze: `.cache/batches/toast/files/` with exact manifests and SHA-256 hashes.

## Ownership and accepted contract

This batch implements Toast under TOAST-001 through TOAST-005 and
TOAST-TRANSPORT-001 in specs/components/toast.md. Earlier frozen navigation,
command-palette, edge-panels and action-menus batches are prerequisites. All previous
frozen batches remain unchanged. Do not import unrelated live snapshot source.

Toast has its own schema-derived named Props and named TSX component. It accepts
controlled open/onOpenChange, title, optional description, intent, priority, named
duration and a zero-argument action. Callback results are synchronous boolean|void.
No native events, styling props, manager SDK or raw timeout numbers are public.

A Surface-scoped private Base UI provider owns one viewport. A private isolated Jotai
queue reserves slots atomically, including concurrent mounts: at most three messages
are visible and 32 are registered. Excess declarations wait for a released slot.
Templates and direction follow each declaration. The active modal portal host is kept
accessible; retained inactive ancestors do not register notifications.

## Shared integration proposals

Merge aggregate.patch deliberately; do not replace root aggregates wholesale.

- Add Toast/ToastProps to components/index.ts and ComponentCatalog/COMPONENT_NAMES.
  Root index.ts already exports that barrel and needs no additional export.
- Spread toastEntries into the shadcn registry and add the exhaustive sample.
- Wrap Surface children in ShadcnToastProvider. It owns the private provider, queue and
  viewport; preserve the existing ThemeVariablesContext and native Surface element.
- Add toastVariables to templateVariables and import toast.css.
- Add Toast to generative leaves, writable boolean catalog bindings, registered action
  reference collection and BoundToast dispatch. There is no new state kind.
- Regenerate schema/generative.schema.json after merging root unions.
- Mount ToastExample in NavigationExamples and add docs navigation/index entries.
- Extend packed consumer fixtures with ToastProps and Toast SSR smoke. Transient
  notifications register after hydration, so their title is absent from SSR output.

## Lifecycle invariants and regression fixes

Escape/Close requests prevent the Base UI handler before invoking the logical callback.
Accepted requests forward to the SDK inside the original event, with a forwarding guard
that prevents a duplicate onClose callback. False/invalid requests keep the notification
and its focus. Native timer/swipe rejection is reconciled before paint and becomes
persistent. Actions receive exactly zero arguments; open changes receive only false.

Metadata updates omit timeout when its resolved value is unchanged. Unrelated parent
rerenders preserve elapsed duration, including fresh ordinary action objects. Actual
duration changes restart timing. Hover/focus/window visibility retain native pauses.

Host-driven state closure can occur outside the SDK event. The focus controller captures
prior/next connected targets before cleanup, ignores native focus guards, and restores
focus in a guarded microtask after React commit restoration. It respects a newer host
focus choice and skips disconnected/ending/limited targets. External closure emits no
extra onOpenChange callback. This also covers an action that closes host state directly
with closeOnAction=false.

The message area scrolls independently and is excluded from swipe handling. A visible
44px grip provides native touch dismissal alongside the named close button. Viewport
width is inset-driven rather than inheriting the Surface's 100% width.

## Verification evidence

- 34 scoped tests in 12 files passed. All 16 executable files, including the affected
  Surface, have 100% statements, branches, functions and lines. Three empty/type-only
  modules are listed by the coverage tool. No runtime coverage exclusion was added.
- Coverage totals: 219 statements, 132 branches, 49 functions and 192 lines.
- All 15 production Chromium cases passed with one worker on port 5178: both templates,
  240/375/1440px, LTR/RTL, 200% text scale, two stacked messages and an unbroken
  520-character
  title, reduced motion, viewport bounds, F6/Tab/Escape, focus progression and actions.
- Browser proof also covers real timer hover/resume, urgent announcement and veto focus,
  native CDP touch scrolling and grip swipe dismissal, using the configured base URL.
- Independent review added controlled-edges.test.tsx. Its three tests and an independent
  real Chromium diagnostic confirm timer preservation plus origin focus for external
  closure and closeOnAction=false. Callback arguments remain exact. Evidence is copied
  into the frozen evidence directory, including the original failing regression log.
- Four strict TypeScript projects, explicit 42-file type-aware lint, source policy,
  schema freshness, strict MkDocs, build/bundle and packed consumer smoke passed.
- Source limits remain 300 lines, 88 columns, two spaces and English. Generated schema
  JSON retains the repository's established generated format.
- Browser worker servers are stopped. Root combined checks and catalog acceptance remain
  the integrator's responsibility. Schema validity does not prove browser rendering.

References: official Nuxt Toast, Base UI 1.9.0 Toast and shadcn Base UI Toast docs are
listed in the component specification. No dependency was installed or changed.

## New paths

- demo/e2e/toast.spec.ts
- docs/components/toast.md
- docs/examples/toast.test.tsx
- docs/examples/toast.tsx
- specs/components/toast.md
- specs/integration/toast.md
- src/adapter/shadcn/registry/toast.ts
- src/adapter/shadcn/toast/controlled-edges.test.tsx
- src/adapter/shadcn/toast/toast-data.ts
- src/adapter/shadcn/toast/toast-focus.test.ts
- src/adapter/shadcn/toast/toast-focus.ts
- src/adapter/shadcn/toast/toast-provider.tsx
- src/adapter/shadcn/toast/toast-queue-context.ts
- src/adapter/shadcn/toast/toast-queue.test.ts
- src/adapter/shadcn/toast/toast-queue.ts
- src/adapter/shadcn/toast/toast-registration.tsx
- src/adapter/shadcn/toast/toast-scope.test.tsx
- src/adapter/shadcn/toast/toast-timers.test.tsx
- src/adapter/shadcn/toast/toast-viewport.tsx
- src/adapter/shadcn/toast/toast.adapter.tsx
- src/adapter/shadcn/toast/toast.test.tsx
- src/components/toast/index.ts
- src/components/toast/toast.props.ts
- src/components/toast/toast.tsx
- src/components/toast/toast.types.test.ts
- src/core/toast-policy.test.ts
- src/core/toast-policy.ts
- src/renderer/styles/toast.css
- src/renderer/theme/toast-variables.test.ts
- src/renderer/theme/toast-variables.ts
- src/schema/toast/generative.schema.ts
- src/schema/toast/toast.schema.ts
- src/schema/toast/toast.test.ts
- src/state/generative-ui/bound-toast.tsx
- src/state/generative-ui/toast.test.tsx

## Modified shared paths

- demo/catalog/navigation-examples.tsx
- docs/components/index.md
- mkdocs.yml
- schema/generative.schema.json
- src/adapter/shadcn/__tests__/catalog-examples.tsx
- src/adapter/shadcn/shadcn.adapter.ts
- src/adapter/shadcn/surface/surface.adapter.tsx
- src/components/catalog.ts
- src/components/index.ts
- src/renderer/styles.css
- src/renderer/theme/template-variables.ts
- src/schema/generative-v2/action-references.ts
- src/schema/generative-v2/catalog-bindings.ts
- src/schema/generative-v2/leaf-nodes.schema.ts
- src/state/generative-ui/node-view.tsx
- tooling/package/fixtures/consumer.tsx.txt
- tooling/package/fixtures/runtime.mjs.txt
