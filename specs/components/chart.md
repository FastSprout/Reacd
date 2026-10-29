# Chart

Status: approved curated API before implementation. Browser acceptance remains separate.

CHART-001: Provide a closed named TSX Chart with required label and description, kind
line/area/bar/donut, readonly unique-id labelled categories and readonly unique-id
labelled series. Each series supplies one finite number or null per category. Named core
policies bound categories, series and numeric magnitude. No arbitrary SVG, CSS, canvas,
formatters, rendering callbacks or chart-engine definitions are public.

CHART-002: Cartesian charts include zero in the numeric domain and handle positive,
negative, constant and all-zero data. Missing null values remain missing; line/area
segments never bridge them, and bars omit them. Donut accepts exactly one series with
nonnegative numbers or null. An all-zero/missing donut has explicit empty content, never
an invalid arc. Empty categories or series render named empty content.

CHART-003: The trusted shadcn adapter owns deterministic SVG geometry. Its visible
traces use template text color, whose contrast against surface is already validated. Do
not assume primary or muted colors contrast with a custom surface. Patterns, dash styles
and markers distinguish series without requiring color perception. Geometry uses named
policy values, not application dimensions. No animation is required.

CHART-004: Always present a semantic table of original category and series values, with
a caption and scoped column/row headings. Missing values have explicit text. Long labels
wrap and wide tables scroll inside a named focusable region without page overflow. Chart
graphics have a semantic label and description; they expose no fake hover, selection or
keyboard interactions. Loading/error states replace the data view. Optional retry uses a
real host callback and only appears when provided. Retry receives no arguments; browser
events and SDK details stay inside the adapter.

CHART-005: Jotai hosts supply typed reactive data with isolated application and SSR
stores. Optional JSON transports validated literal series and a registered retry action.
They do not introduce raw chart configuration or a second hidden state store. Server
markup and hydration use no ambient clock, locale or viewport measurement.

CHART-006: Acceptance covers strict schemas, unique IDs, budgets, invalid dimensions,
negative/zero/missing values, gap geometry, donut zero totals, meaningful SVG and table
output, retry/empty/error/loading, host data replacement, custom inverted templates,
SSR/hydration and both density profiles at 240/360/768/1440 widths and 200% text. Every
owned executable file must retain 100% statement/branch/function/line coverage.

Primary reference: Nuxt UI Chart's official source. The curated adaptation deliberately
omits custom engine definitions, SVG escape hatches and pointer-driven tooltips.
