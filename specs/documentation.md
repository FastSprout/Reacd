# Documentation contract

DOCS-001: Build documentation with MkDocs. Documentation, navigation, examples,
diagnostics, and public API descriptions use English.

DOCS-002: Configure the canonical site URL as `https://reacd.dev/`. Development and
review remain local. Do not change DNS or deploy the site.

DOCS-003: Keep internal specifications in the repository's `specs/` directory. They must
not be copied, linked, indexed, or published by the product site.

## Required documentation

- Product purpose and the exact application/framework boundary.
- Local setup and complete validation commands.
- The six layers and their allowed dependencies.
- Core policies, defaults, units, and resource budgets.
- A page for each component and its supported behavior.
- Adapter authoring and the first shadcn/ui adapter.
- Templates, appearance tokens, and state-preservation requirements.
- Controlled state, forms, actions, navigation, and error handling.
- Optional generative JSON and its relationship to normal TSX.
- Product-facing architecture and supported capabilities.

Internal decisions, implementation plans, acceptance checklists, and verification
reports stay in `specs/`. They are not product documentation.

DOCS-004: Runnable examples compile against public exports. Do not publish pseudocode as
a copy-and-run example or expose private implementation imports.

DOCS-005: Component documentation includes props, defaults, keyboard behavior,
accessibility, states, validation failures, and adapter support.

DOCS-006: The site builds in strict mode with valid local links and navigation.
Generated output stays out of source control.

DOCS-007: Documentation distinguishes implemented, verified, and planned behavior. It
makes no unsupported latency, performance, or bug-free guarantees.

## Public site experience

DOCS-008: Use Nuxt UI as a reference for documentation structure and interaction, not as
the application runtime. Keep MkDocs as the documentation platform.

DOCS-009: Provide a product landing page, searchable component navigation, live
previews, TSX source, property tables, and runnable examples.

DOCS-010: Live previews use reacd components and the shadcn/ui adapter. They are not
screenshots, unrelated widgets, or a JSON editor presented as the product.

DOCS-011: Compile preview examples against public package exports. Preview and source
must describe the same behavior. Preview errors fail validation.

DOCS-012: Keep reacd identity and content. Do not copy Nuxt branding, claims, customer
logos, or product metrics.

DOCS-013: The main `npm run check` command must run the strict MkDocs build. Missing
documentation tooling, invalid navigation, unresolved links, or build warnings fail the
check. CI creates `.venv-docs` with Python 3.13 and installs the pinned requirements
before running the same command. Building is local and never deploys the site.

Reference: [Nuxt UI](https://ui.nuxt.com/).

## Local operation

Use the documented local build and serve commands. Keep the documentation tool
dependencies pinned and reproducible. Do not introduce a deployment command that can be
accidentally executed by a normal quality check.

Setting MkDocs `site_url` establishes canonical links. It is not a deployment operation.
See the [MkDocs configuration reference][configuration].

[configuration]: https://www.mkdocs.org/user-guide/configuration/#site_url

DOCS-014: Additional public layout and compatibility APIs require their own reference
pages and runnable, compiled TSX examples, with colocated behavioral tests. Cover
CodeBlock, CodeEditor, DataTable, Divider, Grid, HStack, Navigation, Section, Spacer,
Spinner, SplitView, SubmitButton, Text, TextArea, Toggle, Toolbar, VStack and Viewport.
Interactive examples use application-scoped Jotai state. The live workbench mounts
these same examples with unique labels/captions. Keep existing public contracts and
legacy names; document actual 0.2 transport support without inventing new routes.

DOCS-016: Every public component reference embeds its registered runnable TSX example.
The code snippet includes that same source file. A dedicated trusted preview bootstrap
creates isolated application state. Unknown URLs and failed imports show accessible
errors. See docs-live-previews.md for the closed URL and build acceptance contract.
