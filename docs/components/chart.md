---
template: preview.html
reacd_preview: Chart
reacd_preview_height: 560
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

Traces use validated template text contrast. Patterns, dashes and markers distinguish
series without depending on arbitrary primary colors. SVG rendering is private to the
adapter. There are no public SVG props, CSS, custom formatters or chart-engine objects.
The original semantic table always remains available and scrolls locally if needed.

Use Jotai for application data. Optional generative transport accepts the same literal
content and a registered retry action. Chart does not invent its own application store.
It uses deterministic geometry and has no ambient locale, clock or viewport defaults.

The live reference offers kinds, missing/zero/empty data, direction, an inverted
template and real loading/error/retry transitions. It compiles from
`docs/examples/chart.tsx`. This curated contract does not provide tooltips, selection,
drag, animation or arbitrary Nuxt/TanStack chart definitions.
