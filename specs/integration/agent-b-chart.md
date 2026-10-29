# Agent B: Chart delivery

Scope: CHART-001..006, locally in fork-b. No new dependencies. This is a curated passive
visualization contract, not arbitrary Nuxt/TanStack engine parity. Root verification and
inventory status remain Agent A's responsibility.

## API and behavior

components/chart/index.ts exports Chart, ChartProps, ChartSeries and ChartCategory. Own
schema/chart exports chartSchema, chartContentSchema, validChartData and
chartNodeSchema. Props have required label/description and readonly categories/series;
optional kind defaults to line, with area/bar/donut also supported. Data states and real
zero-argument retry capabilities are explicit.

Geometry handles signed domains including zero, constant/all-zero observations and null
gaps. Line/area never bridge missing points. A donut accepts a single nonnegative
series; zero/missing totals render empty graphics with the table retained. Trusted SVG
uses currentColor from validated template text contrast, with matching
dash/marker/pattern legends. It does not assume primary contrasts against the surface.
Every ready chart has a semantic original-value table with explicit missing-value text.

The closed contract has no raw SVG/CSS, dimensions, custom formatters, chart engine
objects, tooltips, drag or fake selection handlers. Categories are identified in the
original table; the curated graphic does not provide configurable axis ticks.

GenerativeChart consumes validated literal content and a registered retryAction. Its
callback checks ownership and type again to guard stale capabilities. Host Jotai data
and isolated SSR stores remain the application's source of truth.

## Shared integration in B

The parent delegated a short exclusive Chart aggregate window, now released.

- components/catalog.ts adds ChartProps and Chart's catalog/name entry.
- components/index.ts exports the owned component/types.
- adapter/shadcn/shadcn.adapter.ts merges chartEntries using renderEntry.
- adapter/shadcn/**tests**/examples.tsx merges CHART_EXAMPLES.
- adapter/shadcn/styles.css imports renderer/styles/chart.css.
- schema/generative-v2/leaf-nodes.schema.ts includes chartNodeSchema.
- schema/generative-v2/action-references.ts registers optional Chart retryAction.
- state/generative-ui/node-view.tsx dispatches GenerativeChart (292 lines at delivery).
- demo/catalog/data-examples.tsx mounts ChartExample.
- mkdocs.yml adds components/chart.md. Internal specifications stay outside docs/.

Merge additions into root deliberately; never replace unrelated aggregate source.

## Verification

- .cache/chart-before.log and .cache/chart-adapter-before.log record missing-module
  acceptance before implementation. .cache/chart-area-before.log captures the area
  subpath regression before its geometry fix.
- .cache/chart-coverage-final.log: 11 tests across seven files passed. All 14 owned
  executable files have 100% statements, branches, functions and lines (134/100/52/122
  covered totals). Global coverage includes/thresholds remain unchanged. The scoped
  process reports nonzero global coverage for unrelated unexercised files.
- .cache/chart-lint.log: explicit --no-ignore --type-aware --deny-warnings passed.
- .cache/chart-owned-policy.log: zero owned source-policy findings.
- .cache/chart-types-integrated.log reports no Chart errors; whole-snapshot diagnostics
  were concurrent Form exports/tests. The official build attempt .cache/chart-build.log
  was blocked by concurrent BoundInput's maxLength literal inference, not Chart.
- .cache/chart-demo-build.log: production Vite demo compilation passed.
- .cache/chart-browser.log: all ten Chromium cases passed on port 5197, both density
  profiles at 240/360/768/1440, 200% text and RTL, with an inverted template using black
  surfaces and white text, kinds, signed/missing/zero/empty data and
  loading/error/retry.
- .cache/chart-desktop.png and .cache/chart-narrow.png were visually inspected. Text
  remains readable and the original data scrolls locally at the narrow zoomed width.
- .cache/chart-docs.log: strict MkDocs build uses root's installed interpreter and
  writes exclusively to fork-b/.cache/chart-docs-site.

## Frozen paths

.cache/chart-owned.json lists component-owned paths. The frozen batch contains exact new
source/tests/spec/docs files and a checksummed manifest under .cache/batches/chart/.
Shared aggregates are proposals listed above, not replacement files. Tool-generated
coverage, screenshots, cached upstream sources and manifests retain their formats
outside maintained-source limits. No runtime code is excluded.

.cache/chart-upstream.json records the official Nuxt Chart source and SHA256. No Vue
source is copied into production. Table is a separate unfinished batch; it is not part
of this Chart delivery.
