---
reacd_preview: DashboardResizeHandle
---

# DashboardResizeHandle

A constrained keyboard and pointer resize control between dashboard regions.

## Runnable dashboard

All ten dashboard components participate in this compiled, interactive example. The live
catalog preview exposes the same Jotai state and controls.

<!-- reacd-live-preview -->

```tsx
--8<-- "examples/dashboard.tsx"
```

## Contract

| Property | Meaning                                                |
| -------- | ------------------------------------------------------ |
| label    | Optional visible-to-assistive-technology name override |
| disabled | Optional local disabled state                          |

The group supplies handles automatically between adjacent regions. A handle declaration
inside a region configures that region's existing native boundary separator. It sets the
accessible label and disabled state without creating a nested resize engine. Exactly one
SDK separator remains at the supported boundary location. Duplicate declarations produce
a diagnostic and disable the ambiguous boundary.

Arrow keys resize the adjacent pair by five shares; Shift retains the native step. Home
and End move to constraints. Horizontal keys use the SDK’s Left/Right semantics. Pointer
cancellation, lost capture and focus loss complete the native interaction. Rejected host
candidates do not fabricate local sizes.

Handles are inactive while collapsed or in narrow reflow. The final region has no
following boundary; declaring a handle there produces a diagnostic, as does missing
group/region context. Native event, style, pixel sizing and arbitrary handle-rendering
props are unavailable.

The shadcn adapter supports this closed contract. Native tags, classes, inline styles
and vendor-specific escape hatches remain unavailable to application authors.
