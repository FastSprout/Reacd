# reacd engineering rules

## Authority and workflow

- Work from local, gitignored `specs/` using spec-driven development.
- Keep specifications, agent coordination and private evidence out of Git.
- Update affected requirements before changing behavior.
- Implement acceptance tests, then code, then record verification evidence.
- This is an enterprise implementation, not a JSON-first prototype.
- All work stays local. Do not commit, push, publish, deploy, or change DNS.

## Architecture

```text
core <- schema <- components <- renderer <- adapter <- state
```

- Dependencies point left. Do not introduce reverse imports or cycles.
- Run `npm run lint:layers`; architecture violations must fail CI.
- Declare application UI in TSX using reacd components.
- No native HTML, CSS, Tailwind, styling props, or DOM mutation in applications.
- Keep native rendering in the trusted renderer and adapter layers.
- Every component has its own module. Barrels only re-export.
- Colocate tests with their modules; shared helpers live in `test-support/`.
- Keep browser conformance in `test-support/browser/e2e/`.
- Do not create a root `tests/` tree or a public demo application.
- shadcn/ui is the first theme adapter. MUI obeys the same native SDK rules.
- shadcn/ui is the default adapter for applications, examples and documentation.
  Its default light and dark palettes use black, white and neutral grays.
  Custom color palettes require an explicit design template.
  Material UI requires an explicit selection. A missing component in an explicitly
  selected adapter still throws; never switch adapters to hide missing support.
- Generate the site from Markdown with the project's own TypeScript generator.
- Build the entire website in closed reacd TSX, using shadcn/ui by default.
- Do not mix an external documentation theme or UI runtime with reacd.
- Jotai owns application state. Use isolated stores for apps and SSR requests.
- JSON is an optional generative transport, not the primary authoring API.
- Named core policies own behavioral limits, defaults, and layout constraints.
- Do not hide arbitrary styling or behavior values inside components.

## Native SDK adapters

- An adapter maps reacd declarations directly to its selected UI SDK components.
- Use the SDK's actual component APIs, rendering, interaction, accessibility,
  animation and styling. Do not recreate those mechanisms in reacd.
- Do not create or extend a shared UI implementation between adapters.
- Adapters must not import or render `Shared*` components, use `bindPrimitives`,
  or depend on `src/adapter/shared` UI implementations.
- Do not wrap generic elements in custom styles to imitate an SDK component.
- Do not override SDK control geometry or animations through common renderer CSS.
- Map design templates through the SDK's supported theme or token configuration.
- If the SDK has no one-to-one component, compose it from that SDK's available
  components and supported APIs. Absence of an identically named export is not
  sufficient reason to declare the reacd component unsupported.
- Such compositions belong to the selected adapter, never a shared UI layer.
  Preserve SDK controls and behavior rather than rebuilding them from generic DOM.
- Shared contracts, schemas, validation and state do not constitute shared UI.
  They must not contain control markup, visual styling or interaction engines.
- If the selected adapter cannot support a component through its SDK, throw an
  explicit `UnsupportedAdapterComponentError` identifying adapter and component.
- Never fall back to another adapter, shared UI, native HTML, a placeholder,
  a homemade equivalent, or silently omitted content for an unsupported component.
- Do not claim full component support when components are unsupported.
- Architecture checks must reject forbidden shared UI dependencies. Acceptance
  tests must verify native SDK usage and unsupported-component exceptions.
- Existing violations require migration; do not preserve or rename them merely
  to satisfy an import check or a coverage target.

## Source quality

- Use English for code, comments, diagnostics, UI, specs, and documentation.
- Maintained files have at most 300 lines and 88 characters per line.
- Use two spaces for indentation, never tab characters.
- Tool-generated artifacts retain their required formats; list exclusions.
- Use TypeScript 7 with strict and exact optional-property checks.
- No `any`, non-null assertions, unsafe casts, or type-check suppression.
- Treat external data as `unknown` and validate it before use.
- Keep 100% statement, branch, function, and line coverage per production file.
- Do not lower thresholds, exclude runtime code, or ignore coverage paths.

## Documentation and checks

- Use the local Markdown site generator with canonical URL `https://reacd.dev/`.
- Do not depend on MkDocs, Python themes, Jinja templates or React widget islands.
- Keep native document mounting and rendering inside trusted framework layers.
- Keep internal specifications and verification records out of `docs/`.
- Match Nuxt UI's homepage and documentation layout and interactions one-to-one.
  Use reacd identity, actual capabilities and source-backed examples.
- Compile runnable TSX examples and test live component previews.
- Run all local checks before reporting implementation complete.
- Distinguish specifications, implementation, and verified behavior.
- Never claim that schema validation proves browser rendering correctness.

## Readable examples

- Keep public examples simple, focused and readable. Demonstrate one component
  or one coherent application task at a time.
- Use closed reacd TSX declarations with only the imports the example needs.
- Keep Jotai state and event handlers straightforward and close to their use.
- Prefer explicit, clearly named code over clever abstractions, generic factories
  or compressed expressions that hide how the example works.
- Keep preview controls, adapter selection, documentation infrastructure and
  stress-test fixtures outside the source shown to users.
- Show normal, understandable sample data. Put exhaustive edge cases in tests.
- Keep displayed snippets synchronized with the actual compiled runnable source.
- Do not simplify examples by omitting required dependencies or important logic;
  make the complete example easy to understand instead.
