# Page presentation delivery

Workspace: .cache/workspaces/layout. Agent A owns this five-entry batch. No source was
written to the root or fork-a. The batch requires reviewed integration, not a snapshot
replacement. Scope: PageHeader, PageFeature, PageCard, PageHero and PageSection.

## Closed API

Each component has its own public module, named Props inferred from its strict schema,
shadcn entry, compiled reference example and optional generative node factory. Exact
contracts and acceptance: specs/components/page-presentation.md.

- PageHeader: headline/title/description, links/children.
- PageFeature: title/description, leading/children, orientation, title href or onPress.
- PageCard: feature content plus header/footer, reverse, variant, intent, highlight,
  spotlight. Actions belong only to the title; arbitrary children remain independent.
- PageHero: introduction plus top/header/footer/bottom, orientation/reverse, children.
- PageSection: hero composition plus leading/features.

Default feature orientation is horizontal; other components default vertical. Horizontal
is intrinsic and wraps. Reverse reorders keyed DOM regions while preserving descendants.
Intent controls the decorative highlight border. Body and control foreground colors keep
the template's validated contrast pairs. Spotlight is hover/focus-within emphasis, not a
pointer-tracking overlay. No new dependency or application state kind is introduced.

## Shared integration

New paths and proposed shared modifications are listed separately in
.cache/batches/page-presentation/manifest.json. Frozen source lives under the adjacent
files/ tree. Shared versions are comparison material only; merge their changes.

1. Register five component names and Props in the public catalog/export barrels.
2. Spread pagePresentationEntries into shadcnAdapter.
3. Import renderer/styles/page-presentation.css and spread pagePresentationVariables()
   into templateVariables.
4. Add each generic node interface directly to the recursive GenerativeNode alias.
   An intermediate recursive union alias fails under TypeScript 7.
5. Spread pagePresentationNodeSchemas() into the generative discriminated union.
6. Visitor: links for Header/Hero/Section, leading for Feature/Card/Section,
   header/footer for Card/Hero/Section, top/bottom for Hero/Section, features for
   Section, and ordinary children. All descendant actions are validated pre-render.
7. nodeActionReferences includes optional PageFeature/PageCard action names.
8. GenerativeNodeView routes these five node types to PagePresentationNodeView.
9. Mount PagePresentationExamples outside SplitView for the full-width geometry checks.
10. Merge five MkDocs component references and catalog conformance fixtures.

### Heading semantics

New renderer-owned HeadingLevelContext starts at level one and saturates at six. Page
scopes child headings one level deeper and renders a section when already inside Main.
Section uses at least level two, then scopes descendants. Page presentation titles use
the current context and scope child slots beneath their own title; absent titles do
not create a phantom level. Trusted createElement renders native heading tags without
exposing an application as/tag override.

Changes to renderer/page/page.renderer.tsx and renderer/section/section.renderer.tsx
are explicit reviewed modifications. Existing root RTL, Pagination navigation, form
bridge and adapter corrections are not included or overwritten.

## Verification

- Acceptance red: four adapter tests failed before public modules existed.
- Scoped final unit/SSR/hydration/type/example tests: 19 files, 32 passing tests.
- 39 executable files, including both modified Page/Section renderers, have 100%
  statements, branches, functions and lines. Ten type-only/barrel files are empty.
- Coverage: 113 statements, 74 branches, 35 functions and 109 lines. Report:
  .cache/coverage/page-presentation/coverage-summary.json.
- Strict four-project typecheck, actual lint scan, source policy, production build and
  strict MkDocs passed. Logs:
  .cache/page-presentation-{types,lint,policy,build,docs}.log.
- Sixteen real production Chromium scenarios passed: both templates, four widths
  (240/320/768/1440), scoped LTR/RTL and 200% text. Tests measure actual horizontal and
  wrapped geometry, direction, DOM order, containment, independent action focus order
  and retained Jotai draft values through layout/template changes.
- Visual inspection: Compact 320px RTL and Spacious 1440px LTR screenshots at 200% text
  show wrapped unbroken headings, visible fields and separate content regions. Files:
  .cache/page-presentation-{Compact-320-rtl,Spacious-1440-ltr}.png.
- Browser preview server on 5176 terminates with the test run.

The snapshot needs an empty local .git directory to prevent ancestor .cache ignores
from hiding files from oxlint. No git repository initialization or commit was performed.
PageAside's existing useMemo callback was corrected locally to match fork-a's fix; that
already integrated unrelated change is deliberately absent from this delivery.

Combined root coverage, package checks, browser regression and schema freshness remain
the integrating agent's acceptance gate. Do not mark inventory entries Verified based
only on this scoped evidence.
