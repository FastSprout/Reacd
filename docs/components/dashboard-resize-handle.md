---
template: preview.html
reacd_preview: DashboardResizeHandle
reacd_preview_height: 560
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

The group supplies handles automatically between adjacent regions. An additional handle
can be declared within a region that precedes another region. The handle consumes that
region's engine context; it cannot replace behavior with arbitrary DOM callbacks.

Arrow keys resize the adjacent pair; Shift uses a larger step. Home and End move to
constraints. Horizontal movement respects scoped RTL direction. Pointer cancellation,
lost capture and focus loss restore the previous layout; capture is released on finish
and unmount. Rejected host candidates do not fabricate local sizes.

Handles are inactive while collapsed or in narrow reflow. The final region has no
following handle. Missing group/region context produces a diagnostic. Native event,
style, pixel sizing and arbitrary handle-rendering props are unavailable.

The shadcn adapter supports this closed contract. Native tags, classes, inline styles
and vendor-specific escape hatches remain unavailable to application authors.
