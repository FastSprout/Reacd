---
template: preview.html
reacd_preview: DashboardPanel
reacd_preview_height: 560
---

# DashboardPanel

A named dashboard content region with safe header and footer composition.

## Runnable dashboard

All ten dashboard components participate in this compiled, interactive example. The live
catalog preview exposes the same Jotai state and controls.

<!-- reacd-live-preview -->

```tsx
--8<-- "examples/dashboard.tsx"
```

## Contract

| Property | Meaning                                                 |
| -------- | ------------------------------------------------------- |
| label    | Optional region override; required when used standalone |
| header   | Safe navbar or other header content                     |
| children | Safe body content                                       |
| footer   | Safe secondary actions                                  |

The first content panel may own the main landmark. Other panels and panels within an
existing main scope become named sections. Nested groups and sidebar content cannot
introduce duplicate main landmarks. Header and footer remain ordinary content; no fixed
height clips the body.

Inside a DashboardGroup the region label supplies the default accessible name. A
standalone panel must supply label explicitly. Generative transport validates and visits
all three content slots before rendering actions.

The shadcn adapter supports this closed contract. Native tags, classes, inline styles
and vendor-specific escape hatches remain unavailable to application authors.
