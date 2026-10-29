---
template: preview.html
reacd_preview: DashboardSidebarCollapse
reacd_preview_height: 560
---

# DashboardSidebarCollapse

A desktop control for its nearest dashboard navigation surface.

## Runnable dashboard

All ten dashboard components participate in this compiled, interactive example. The live
catalog preview exposes the same Jotai state and controls.

<!-- reacd-live-preview -->

```tsx
--8<-- "examples/dashboard.tsx"
```

## Contract

| Property | Meaning                         |
| -------- | ------------------------------- |
| label    | Optional visible label override |
| disabled | Optional local disabled state   |

The default label changes between Collapse navigation and Expand navigation. The control
writes only the nearest group's desktop open value. Mobile state and saved expanded
shares are preserved. Disabled group state also disables this button.

The control is hidden in narrow layouts. Missing DashboardGroup context produces a
visible diagnostic. It is not a global singleton and accepts no native click event or
styling escape. Generative declarations inherit their nearest dashboard state context.

The shadcn adapter supports this closed contract. Native tags, classes, inline styles
and vendor-specific escape hatches remain unavailable to application authors.
