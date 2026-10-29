# Layout integration handoff

## Ready batch: structural shells

- Container/Main/Header/Footer/Separator each have a named public function in
  `src/components/<name>/<name>.tsx`, their own `.props.ts` and `index.ts`.
- Schemas: `src/schema/<name>/<name>.schema.ts`, export `<name>Schema`.
- Adapters: `src/adapter/shadcn/<name>/<name>.adapter.tsx`, export `ShadcnContainer`,
  `ShadcnMain`, `ShadcnHeader`, `ShadcnFooter`, `ShadcnSeparator`.
- Core defaults/dimensions: `src/core/shell-policy.ts`.
- CSS: `src/renderer/styles/shells.css`.
- Variables: spread `shellVariables()` from renderer/theme/shell-variables.ts.
- Single-main context: renderer/main/main-scope.ts exports MainScopeContext. Main and
  Page provide true to descendants; nested Main renders a section.
- Compiled examples and public docs use the component's kebab-case name.
- demo/catalog/shell-examples.tsx exports ShellExamples for LayoutExamples.
- Browser suite: demo/e2e/shells.spec.ts, root coordinates execution.

### Generative transport

Per-component `generative.schema.ts` exports `<name>NodeSchema(content)` and
`<Name>Node<Content>`. All children slots are required arrays. Footer/Header support
optional start/end/top/bottom arrays; Header.menu has content array and boolean writable
open binding. Separator composes content through children.

BoundHeader in state/generative-ui/bound-header.tsx accepts properties with mapped
Header slots, nonnullable menu node, mapped menu content and registry. The central
visitor must visit every shell slot and Header.menu.content.

### Evidence

- Focused schema/adapter/theme tests: 11 files / 28 tests passed.
- Focused examples/types/family tests: 11 files / 12 tests passed.
- Generative integration: 1 file / 4 tests passed, including writable menu state, every
  slot action traversal, incompatible/missing state and SSR.
- Combined first and second batches: 38 test files / 71 tests passed; 48 production
  files have 100% statements, branches, functions and lines. Report:
  .cache/coverage/layout-current/coverage-summary.json.
- Browser results remain pending coordinated verification.

## Ready batch: application context

App/Error/Theme modules and schema/adapter exports use the same conventions. CSS import
required: renderer/styles/application-context.css.

- App: children, optional direction ltr/rtl and language tag. Uses Base UI
  DirectionProvider. ReacdProvider remains the state/adapter host.
- Error: required statusCode 400..599 and title; optional message, children, leading,
  actions, redirect and recoveryLabel. Redirect uses safe link schema.
- Theme: optional validated full DesignTemplate and a closed defaults map. Supported
  defaults are Button intent, Text role/weight/lineLimit, layout spacing, Separator
  presentation. Required content remains explicit. Theme scopes ThemeVariablesContext
  for descendant portals and RenderContext for validated appearance defaults; native
  styling hooks remain unavailable.

Per-component generative.schema.ts modules export appNodeSchema, errorNodeSchema and
themeNodeSchema factories and generic node interfaces. All have required children
arrays; Error additionally accepts optional leading and actions arrays. No direct state
bindings are introduced by these nodes. Central visitor traverses every slot to validate
descendant actions.

Public examples are mounted in ShellExamples. Avoid duplicate direct mounts in
LayoutExamples. Browser suite: demo/e2e/application-context.spec.ts.

Current production source is frozen for the root coordinated verification gate.
Sidebar/Splitter remain research/specification work during that gate.
