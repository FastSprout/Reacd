---
template: preview.html
reacd_preview: Table
reacd_preview_height: 560
---

# Table

Table supports static text grids and controlled interactive business data.

<!-- reacd-live-preview -->

```tsx
--8<-- "examples/table.tsx"
```

```tsx
import { Table } from '@fastsprout/reacd';

<Table caption="Status" columns={['Name', 'Status']} rows={[['Example', 'Ready']]} />;
```

Static calls remain compatible. They require a caption and one cell per column. Use
`mode="interactive"` for a complete typed model of columns, rows, selection, sorting,
filters and pagination, with `onModelChange(nextModel)`.

```tsx
<Table mode="interactive" caption="Orders" model={model} onModelChange={setModel} />
```

The host owns the model, typically in an isolated Jotai store. Each control requests one
complete next model. Sorting and filtering reset pagination atomically. Host rejection
preserves the visible table. Querying, filters, native controls and local scrolling
reuse the existing DataTable engine.

Omit the callback or set readOnly/disabled to protect changes. Optional `editable`
permissions separately control selection, sorting, filters and pagination. Editable
sorting/filtering requires editable pagination so the reset is a single valid change.
There are no custom cell renderers, HTML, CSS or table-engine options.

Loading, error and empty have explicit states. Retry appears only for a real host
callback and receives no browser event. Long data stays inside a labelled keyboard
scroll region, with a semantic caption and scoped column headings.

Optional generative transport uses existing tableRows, selection, sorting, filters and
pagination state references. Its compound constraints validate relationships before
exposing controls and preserve per-binding reader permissions. Source data replacement
belongs to the host; table view callbacks cannot rewrite rows or columns.

The live reference compiles from `docs/examples/table.tsx` and demonstrates protected
controls, host rejection, paging, sorting, filtering, direction and loading/error/retry.
Virtual scrolling and arbitrary cell templates are outside this curated contract.
