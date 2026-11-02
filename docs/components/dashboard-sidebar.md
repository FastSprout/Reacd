---
reacd_preview: DashboardSidebar
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

The component reuses Sidebar's native Collapsible and modal Sheet behavior. The group
owns responsive scope, even when the sidebar column is narrow. Mobile dismissal stays
available while title, application content and footer scroll together. Escape, outside
dismissal and closing restore the actual opening control.

The component exposes no dimensions, breakpoint, local state singleton or native tags.
All slots are traversed by generative action validation.

The shadcn adapter supports this closed contract. Native tags, classes, inline styles
and vendor-specific escape hatches remain unavailable to application authors.

## Native desktop and mobile transitions

The shadcn adapter composes its native Sheet and Collapsible components. Only one
content tree is mounted at a time. Host-controlled and Jotai application state is
preserved when the container changes between docked navigation and a modal sheet. The
SDK may remount uncontrolled DOM content when that modality changes; persist important
form values in application state. Resizing does not change the separate desktop `open`
and mobile `mobileOpen` values.
