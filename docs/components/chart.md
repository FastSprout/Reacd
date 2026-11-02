---
reacd_preview: Chart
---

# Chart

Chart presents typed numeric series and a readable table of their original values.

<!-- reacd-live-preview -->

```tsx
--8<-- "examples/chart.tsx"
```

```tsx
import { Chart } from '@fastsprout/reacd';

<Chart
  label="Activity"
  description="Count by workflow category."
  kind="bar"
  categories={[{ id: 'review', label: 'Review' }]}
  series={[{ id: 'count', label: 'Count', values: [4] }]}
/>;
```

Choose line, area, bar or donut. Cartesian charts include zero and accept signed values.
Null denotes a missing observation; lines and areas never bridge that gap. Donut accepts
one nonnegative series. Zero or missing totals produce an explicit empty graphic while
the original table remains readable.

Categories and series have unique IDs, readonly data and matching lengths. Limits are 50
categories, six series and numeric magnitude up to one trillion. Malformed data fails
validation. Empty categories/series, loading and error have named states; retry only
appears when an actual host callback is supplied.

Traces retain contrast against their template surface. The default shadcn adapter
uses validated text colors, patterns, dashes and markers. SVG rendering is private to
the adapter. There are no public SVG props, CSS, custom formatters or chart-engine
objects.
The original semantic table always remains available and scrolls locally if needed.

Use Jotai for application data. Optional generative transport accepts the same literal
content and a registered retry action. Chart does not invent its own application store.
Application declarations contain no chart geometry or device breakpoints.

The live example shows monthly sales as a bar chart with its original data table.
It compiles from `docs/examples/chart.tsx`. Applications cannot inject arbitrary
chart-engine definitions, custom renderers or interaction engines.

## Material UI

The Material adapter uses MUI X LineChart, BarChart and PieChart. Area charts use
the native line series area option. Responsive sizing, markers, tooltips, keyboard
interaction and motion follow the SDK's behavior. The original data table stays
available below the chart.

Colors come from the selected Material theme. Palette entries below 3:1 contrast
against the paper surface use its validated text color instead. Native legends
and the data table identify series; this mapping does not add custom SVG patterns
or a separate chart interaction engine.
