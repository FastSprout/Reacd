---
template: preview.html
reacd_preview: DashboardToolbar
reacd_preview_height: 560
---

# DashboardToolbar

A named group of dashboard actions that wraps safely.

## Runnable dashboard

All ten dashboard components participate in this compiled, interactive example. The live
catalog preview exposes the same Jotai state and controls.

<!-- reacd-live-preview -->

```tsx
--8<-- "examples/dashboard.tsx"
```

## Contract

| Property   | Meaning                                  |
| ---------- | ---------------------------------------- |
| label      | Required accessible action-group name    |
| start, end | Optional safe logical edge slots         |
| children   | Safe actions in normal declaration order |

Use the toolbar in a DashboardPanel header or footer. It keeps ordinary sequential Tab
order for arbitrary child controls. It uses group semantics rather than promising a
roving toolbar keyboard model that application children may not implement.

Controls wrap as their content and available width require. Appearance belongs to the
adapter and template. All slots accept reacd content and participate in generative
action validation.

The shadcn adapter supports this closed contract. Native tags, classes, inline styles
and vendor-specific escape hatches remain unavailable to application authors.
