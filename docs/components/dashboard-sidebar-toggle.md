---
template: preview.html
reacd_preview: DashboardSidebarToggle
reacd_preview_height: 560
---

# DashboardSidebarToggle

A mobile control for its nearest dashboard navigation surface.

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

The default label reflects Open navigation or Close navigation. The control writes only
mobileOpen and records the actual opening element for focus restoration. Desktop state
and saved expanded shares remain independent.

The navbar supplies this control automatically; a separate instance can be placed in a
toolbar. It is hidden in wide layouts. Missing group context produces a diagnostic.
Disabled group state disables the control. Generative declarations inherit group state.

The shadcn adapter supports this closed contract. Native tags, classes, inline styles
and vendor-specific escape hatches remain unavailable to application authors.
