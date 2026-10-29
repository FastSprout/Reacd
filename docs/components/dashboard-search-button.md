---
template: preview.html
reacd_preview: DashboardSearchButton
reacd_preview_height: 560
---

# DashboardSearchButton

A named action that opens the host's dashboard search state.

## Runnable dashboard

All ten dashboard components participate in this compiled, interactive example. The live
catalog preview exposes the same Jotai state and controls.

<!-- reacd-live-preview -->

```tsx
--8<-- "examples/dashboard.tsx"
```

## Contract

| Property | Meaning                                  |
| -------- | ---------------------------------------- |
| onPress  | Required host action callback            |
| label    | Optional label, default Search dashboard |
| disabled | Optional native disabled state           |

The button has no implicit search singleton. Its action updates the host's explicit
Jotai open state, shared with DashboardSearch. It remains usable outside DashboardGroup.

The callback receives no browser event. Native styling, icons, DOM mutation and global
shortcut registration are not exposed. A generative declaration supplies a registered
action name; unknown actions are rejected before partial rendering.

The shadcn adapter supports this closed contract. Native tags, classes, inline styles
and vendor-specific escape hatches remain unavailable to application authors.
