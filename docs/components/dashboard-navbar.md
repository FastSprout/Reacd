---
template: preview.html
reacd_preview: DashboardNavbar
reacd_preview_height: 560
---

# DashboardNavbar

A responsive dashboard heading and navigation action row.

## Runnable dashboard

All ten dashboard components participate in this compiled, interactive example. The live
catalog preview exposes the same Jotai state and controls.

<!-- reacd-live-preview -->

```tsx
--8<-- "examples/dashboard.tsx"
```

## Contract

| Property          | Meaning                                                  |
| ----------------- | -------------------------------------------------------- |
| title             | Optional title; defaults to region label, then Dashboard |
| leading, trailing | Safe content next to the title                           |
| start, end        | Safe logical edge slots                                  |
| children          | Safe central navigation content                          |

Inside a dashboard, the navbar includes the mobile sidebar toggle automatically. The
first main panel receives a primary heading; nested panels use a secondary heading. Long
labels and controls wrap in declaration order without application breakpoints.

Use DashboardSidebarCollapse in leading for desktop navigation control. The component
creates no additional banner landmark inside a main region. It exposes no tag selector,
raw icon function, CSS map or dimensions. Generative action preflight visits every slot.

The shadcn adapter supports this closed contract. Native tags, classes, inline styles
and vendor-specific escape hatches remain unavailable to application authors.
