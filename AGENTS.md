# reacd engineering rules

## Authority and workflow

- Work from local, gitignored `specs/` using spec-driven development.
- Keep specifications, agent coordination and private evidence out of Git.
- Update affected requirements before changing behavior.
- Implement acceptance tests, then code, then record verification evidence.
- This is an enterprise implementation, not a JSON-first prototype.
- Keep Git changes local; do not commit, push, deploy, or change DNS.
- Publish a verified npm package only when the user explicitly requests it.

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
- shadcn/ui is the first theme adapter. MUI is later work.
- Jotai owns application state. Use isolated stores for apps and SSR requests.
- JSON is an optional generative transport, not the primary authoring API.
- Named core policies own behavioral limits, defaults, and layout constraints.
- Do not hide arbitrary styling or behavior values inside components.

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

- Use MkDocs with canonical URL `https://reacd.dev/` and local previews.
- Keep internal specifications and verification records out of `docs/`.
- Follow Nuxt UI's documentation experience without copying its branding.
- Compile runnable TSX examples and test live component previews.
- Run all local checks before reporting implementation complete.
- Distinguish specifications, implementation, and verified behavior.
- Never claim that schema validation proves browser rendering correctness.
