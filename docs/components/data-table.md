---
template: preview.html
reacd_preview: DataTable
reacd_preview_height: 560
---

# DataTable

DataTable renders typed rows with selection, sorting, filters, and pagination. The
shadcn/ui adapter implements its controls. Application code supplies data and logical
callbacks without HTML or styling properties.

<!-- reacd-live-preview -->

```tsx
--8<-- "examples/data-table.tsx"
```

## Generative bindings

Declare five independent state keys, then bind a table to them:

```json
{
  "type": "DataTable",
  "caption": "Orders",
  "columns": [
    { "key": "name", "label": "Name", "kind": "text" },
    { "key": "amount", "label": "Amount", "kind": "number" }
  ],
  "bindings": {
    "rows": { "state": "orders.rows", "mode": "read" },
    "selection": { "state": "orders.selected", "mode": "readWrite" },
    "sorting": { "state": "orders.sort", "mode": "readWrite" },
    "filters": { "state": "orders.filters", "mode": "readWrite" },
    "pagination": { "state": "orders.page", "mode": "readWrite" }
  }
}
```

The referenced definitions use `tableRows`, `selection`, `sorting`, `filters`, and
`pagination`, respectively. Rows have the shape
`{ id: "order-a", cells: { name: "Example", amount: 30 } }`. Column kinds are `text`,
`number`, and `boolean`; null cells are allowed. Pagination is
`{ pageIndex: 0, pageSize: 25 }`. The other view states start as empty arrays.

Read-only view bindings display their values and disable editing controls. Writable
sorting and filtering require writable pagination.

## Transition rules

| Operation        | Result                                                      |
| ---------------- | ----------------------------------------------------------- |
| Select rows      | Updates source row IDs, including selections on other pages |
| Sort or filter   | Resets the page index and preserves selection               |
| Change page      | Preserves sorting, filters, and selection                   |
| Replace rows     | Prunes missing selections and clamps the page index         |
| Invalid proposal | Returns diagnostics and leaves every state unchanged        |

Filters apply before stable multi-column sorting and pagination. Null cells sort last in
either direction. Filters support `equals`, `contains`, `greaterThan`, and `lessThan`;
operators and values must match the declared column kind.

## Controller API

`createDataTableController(registry, { columns, bindings })` returns a validated
controller. Its `atom` exposes a reactive snapshot for TSX/Jotai consumers. `select`,
`sort`, `filter`, `paginate`, and privileged `replaceRows` return structured results.
`read()` returns the current snapshot.

Call `connect()` to enforce table invariants on all registry writes. Retain the returned
cleanup function and call it when disposing the controller. GenerativeUI manages this
subscription automatically. A host refresh that affects several keys must use
`replaceRows` or an atomic registry transaction.

The public `DataTable` TSX component accepts the snapshot, `caption`, and optional
`onSelectionChange`, `onSortingChange`, `onFiltersChange`, and `onPaginationChange`
callbacks. Omitted callbacks make those controls read-only.

## Complete declaration

This compiled example includes every state definition and binding. The sample dataset is
read-only for components. Selection, sorting, filters, and pagination are independently
writable. Its tests exercise page resets and selection preservation through the actual
generative renderer and adapter.

```tsx
--8<-- "examples/generative-table.tsx"
```

Choose **Content and data** in the local workbench to use this same compiled example.
