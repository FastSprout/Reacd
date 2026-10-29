---
template: preview.html
reacd_preview: DashboardGroup
reacd_preview_height: 560
---

# DashboardGroup

Coordinates responsive dashboard regions and their controlled state.

## Runnable dashboard

All ten dashboard components participate in this compiled, interactive example. The live
catalog preview exposes the same Jotai state and controls.

<!-- reacd-live-preview -->

```tsx
--8<-- "examples/dashboard.tsx"
```

## Contract

| Property                       | Meaning                                    |
| ------------------------------ | ------------------------------------------ |
| label                          | Required accessible group name             |
| regions                        | Two to eight unique keyed region records   |
| value, onValueChange           | Expanded percentage layout and callback    |
| open, onOpenChange             | Desktop visibility and callback            |
| mobileOpen, onMobileOpenChange | Independent mobile visibility and callback |
| collapseMode                   | offcanvas (default) or icon                |
| disabled                       | Disables structural controls               |
| resizeLabel                    | Optional common resize-handle label        |
| children                       | Safe content outside the region layout     |

Each region is sidebar or panel. Exactly one sidebar and at least one panel are
required. Expanded shares match region IDs and order, satisfy minShare/maxShare, and
total 100. Constraint defaults are 10 and 90. Closing navigation preserves expanded
shares while an engine-derived presentation reallocates space. Icon collapse reserves a
bounded logical share; mobile navigation always uses its independent state.

The full group width and measured rem tracks own responsive behavior. A narrow sidebar
column cannot force a desktop modal. Layout changes retain field state. Nested groups
use independent context. No automatic storage, fixed viewport positioning or size units
are public. Persist the validated value through the host's isolated Jotai store.

Generative UI uses panelLayout plus separate boolean readWrite state keys. Query and
selection data are separate from layout. Runtime constraints also reject incompatible
host writes.

The shadcn adapter supports this closed contract. Native tags, classes, inline styles
and vendor-specific escape hatches remain unavailable to application authors.
