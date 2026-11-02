---
reacd_example: OrdersDashboard
---

# Orders dashboard

Search the sample customer names, then enable **Open orders only**. Searching for `Mina`
with that switch enabled shows the empty state. **Clear filters** restores all sample
rows. Switch adapters while a query is active to check retained state.

<!-- reacd-live-preview -->

## Source

Render `OrdersDashboardExample` inside the `ReacdProvider` shown in
[Get started](../getting-started.md). Filtering belongs to application logic; the table
receives the resulting rows and an explicit empty message.

```tsx
--8<-- "examples/recipe-orders-dashboard.tsx"
```

The rows are local sample data. For sorting, selection and pagination of controlled
records, see [DataTable](../components/data-table.md). For basic tabular data, see
[Table](../components/table.md).
