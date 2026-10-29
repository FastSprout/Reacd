---
template: preview.html
reacd_preview: DashboardSearch
reacd_preview_height: 560
---

# DashboardSearch

An explicitly controlled modal command palette for dashboard actions.

## Runnable dashboard

All ten dashboard components participate in this compiled, interactive example. The live
catalog preview exposes the same Jotai state and controls.

<!-- reacd-live-preview -->

```tsx
--8<-- "examples/dashboard.tsx"
```

## Contract

| Property             | Meaning                                              |
| -------------------- | ---------------------------------------------------- |
| label                | Required visible command input label                 |
| open, onOpenChange   | Required controlled modal visibility                 |
| query, onQueryChange | Required controlled query and callback               |
| groups               | Required CommandPalette group/item definitions       |
| onSelect             | Optional synchronous boolean/void selection callback |
| title, description   | Optional modal copy                                  |
| filtering            | local (default) or external host-ranked results      |
| status               | ready, loading or error                              |
| disabled             | Disables command editing and selection               |
| emptyMessage         | Optional empty state copy                            |
| loadingMessage       | Optional loading state copy                          |
| errorMessage         | Optional failure state copy                          |

The component composes Modal and CommandPalette. A false selection result blocks the
captured action/link and keeps the modal open. Invalid asynchronous return values fail
closed with a visible diagnostic. Accepted selection requests close before invoking the
captured target. The host retains final control over open and query values.

Generative UI uses a boolean open binding and text query/optional selected-key bindings.
Query and selection keys must differ. Selection publication and modal close use one
registry transaction, so a declined write blocks the target without partial state.

There is no document-global shortcut, implicit color-mode command or shared search
singleton. Use DashboardSearchButton with an explicit host callback. Tab, Escape and
focus return follow Modal; command navigation follows CommandPalette.

The shadcn adapter supports this closed contract. Native tags, classes, inline styles
and vendor-specific escape hatches remain unavailable to application authors.
