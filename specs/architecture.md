# Architecture

Layer direction constrains shipped modules. Colocated tests may compose an integration
across layers. Production code must never import tests or helpers.

ARCH-001: Internal dependencies follow this order:

```text
core <- schema <- components <- renderer <- adapter <- state
```

An arrow points toward an allowed dependency. A layer may depend on itself and layers to
its left. It must not import a layer to its right, including through type-only imports,
aliases, dynamic imports, or barrel files.

ARCH-002: The public package entry is a facade. It exposes supported application APIs
without exposing private renderer primitives or adapter implementation details as
application escape hatches.

## Responsibilities

| Layer        | Responsibility                                               |
| ------------ | ------------------------------------------------------------ |
| `core`       | Shared policies, limits, and generic rendering contracts     |
| `schema`     | Runtime validation and schema generation from core contracts |
| `components` | One closed, typed TSX component declaration per module       |
| `renderer`   | DOM backend, accessibility, layout, and rendering contracts  |
| `adapter`    | Concrete design-system mapping; shadcn/ui first              |
| `state`      | Jotai stores, bindings, actions, and composition root        |

ARCH-003: Each component has its own module. A module must not contain several unrelated
component implementations hidden behind a factory or an export list. Shared validation,
ports, and rendering utilities remain separate modules.

The same component name identifies its folder in each relevant layer:

```text
src/
  schema/grid/grid.schema.ts
  components/grid/
    grid.tsx
    grid.props.ts
    index.ts
  renderer/grid/grid.renderer.tsx
  adapter/shadcn/grid/grid.adapter.tsx
  state/provider/
    provider.tsx
    provider.schema.ts
    provider-content.tsx
```

The tree illustrates file naming, not a requirement to add a redundant DOM renderer when
an adapter delegates to an existing safe layout implementation. Each component module
exports a named function and its own named Props type. Module `index.ts` files only
re-export. Registries assemble modules explicitly.

ARCH-004: Component declarations do not import adapters. They dispatch through an
abstract port whose interface belongs to `core`. The composition root binds the selected
renderer and adapter at the `state` layer.

Individual Props types belong to their component modules and derive from their schemas.
Core contracts are generic; core does not contain a concrete Props map.

ARCH-005: Adapter-specific props and library imports do not appear in application
components. An application changes adapters through the composition root. The
application source checker rejects direct imports from the trusted UI integration scopes
@radix-ui/, @base-ui/, @tiptap/, @react-aria/, @react-stately/ and @tailwindcss/. It
also rejects the packages @daypicker/react, react-aria-components, react-dom,
lucide-react, input-otp, clsx, class-variance-authority, tailwind-merge and tailwindcss,
including their subpaths. Similar business-package names outside these boundaries are
not forbidden by this dependency rule. Native UI SDKs remain available to trusted
renderer/adapter code.

ARCH-006: Native elements, browser events, DOM refs, CSS, and design-system integration
code are restricted to the trusted renderer and adapter layers. A minimal browser
bootstrap is infrastructure, not application UI. The import boundary covers static,
type-only, reexport, literal dynamic and literal require forms through the same source
visitor. Computed imports retain their existing rejection.

## Application boundary

Applications may use React state and ordinary business logic. Their views use only reacd
components or their own compositions of reacd components. Named React hooks/types, Jotai
state, public reacd entries, local business modules and ordinary business utilities
remain available; this is not a blanket external-library restriction.

The source checker rejects native JSX elements, styling props, CSS imports, direct DOM
construction, and imports of private renderer internals. Runtime schemas reject
unrecognized component properties and native elements supplied directly as children.

ARCH-007: Enforcement has both static and runtime checks. TypeScript's structural typing
alone cannot prevent every value created by JavaScript or an unsafe cast. Valid external
React components also remain structurally compatible. Mandatory application source
policy rejects the declared UI SDK imports before acceptance; the runtime does not brand
component identities or sandbox JavaScript.

ARCH-008: The framework is not a process sandbox. Filesystem permissions determine
whether an application-writing agent can modify the framework itself.

## Package boundaries

- The main entry exposes application components and state APIs.
- Adapter entries expose adapter definitions, not vendor component APIs.
- A generative entry exposes versioned JSON validation and rendering.
- Private implementation paths are not public package exports.

ARCH-009: Public entry points receive strict consumer-type, SSR, and browser integration
checks. Tests must exercise built package output as well as source.

ARCH-010: Applications use the reacd JSX runtime. Its TypeScript JSX namespace forbids
intrinsic elements, and its runtime rejects native tag names. Framework renderers use
their private React runtime. The source checker also rejects manual DOM and raw
JSX-runtime escape paths.

ARCH-011: Acceptance checks the production local module graph, including type-only
imports and facade re-exports, for cycles. Shared dependency diamonds remain valid.
