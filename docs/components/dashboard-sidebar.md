---
template: preview.html
reacd_preview: DashboardSidebar
reacd_preview_height: 560
---

# DashboardSidebar

A dashboard navigation surface coordinated by its containing group.

## Runnable dashboard

All ten dashboard components participate in this compiled, interactive example. The live
catalog preview exposes the same Jotai state and controls.

<!-- reacd-live-preview -->

```tsx
--8<-- "examples/dashboard.tsx"
```

## Contract

| Property                | Meaning                                      |
| ----------------------- | -------------------------------------------- |
| description             | Optional supporting text                     |
| children                | Safe navigation content                      |
| header, actions, footer | Optional safe slots                          |
| collapsedContent        | Safe content shown for desktop icon collapse |

Place DashboardSidebar in a sidebar-kind DashboardGroup region. The region supplies its
accessible title; the group supplies desktop/mobile state and collapse policy. Missing
or incompatible region context produces a visible diagnostic.

The component reuses Sidebar's single retained content tree and modal behavior. The
group owns responsive scope, even when the sidebar column is narrow. Mobile dismissal
stays available while title, application content and footer scroll together. Escape,
outside dismissal and closing restore the actual opening control.

The component exposes no dimensions, breakpoint, local state singleton or native tags.
All slots are traversed by generative action validation.

The shadcn adapter supports this closed contract. Native tags, classes, inline styles
and vendor-specific escape hatches remain unavailable to application authors.
