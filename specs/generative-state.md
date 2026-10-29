# Generative state and bindings

STATE-EDITOR-001: The richDocument state kind stores only the closed EditorDocument DTO
validated by the bounded editorDocumentSchema. Initial values and whole-document writes
pass unknown-data preflight before schema recursion or cloning. Invalid documents never
partially publish. Read-only component bindings cannot edit; host updates,
subscriptions, transactions and reset retain existing registry semantics. Every
application is isolated. The enclosing generative document's global JSON budgets still
apply to initial data; adding this kind does not raise those budgets or authorize HTML
content.

STATE-FILES-001: The fileList kind stores readonly validated upload DTOs with actual
canonical base64 bytes. Native File/Blob objects never enter public state. Both initial
values and whole-list updates pass the bounded fileListValueSchema before publishing.
Read permissions, host updates, reset and isolated stores retain registry semantics. The
enclosing generative document's JSON budgets still apply to initial data; large files
selected at runtime do not raise transport limits. No network upload is implicit.

STATE-RANGE-001: The numberRange state kind stores a readonly start/end DTO. Both
endpoints are finite numbers and start must not exceed end. Equal endpoints are valid.
Single-number state remains a separate kind. Registry writes validate the whole range
atomically; component constraints may narrow inclusive bounds without weakening them.
Readers, application isolation, subscriptions and reset use the existing state contract.

GENSTATE-001: A generative application declares typed state separately from the
component tree. Each definition has a unique key, kind, initial value, and component
access permissions. Jotai stores own values; nodes reference them.

GENSTATE-002: Bindings are typed references with `read` or `readWrite` access. Display
properties read values. Editable properties require writable bindings. JSON cannot
contain callbacks, expressions, browser events, or property paths.

## Version 0.2 declaration shape

```json
{
  "schemaVersion": "0.2",
  "state": [
    {
      "key": "customer.name",
      "kind": "text",
      "initial": "",
      "access": "readWrite"
    }
  ],
  "root": {
    "type": "VStack",
    "children": [
      {
        "type": "Input",
        "label": "Customer name",
        "value": { "state": "customer.name", "mode": "readWrite" }
      },
      {
        "type": "Text",
        "content": { "state": "customer.name", "mode": "read" }
      }
    ]
  }
}
```

GENSTATE-003: The definition array permits detecting duplicate keys before registry
creation. A dot in a key is a namespace convention, never traversal. Version `0.1`
remains separately validated during the version `0.2` migration.

GENSTATE-004: Validate uniqueness, initial types, references, binding modes, state/prop
compatibility, and component capabilities before rendering. Text cannot write state.
Input cannot edit numeric or table data as a string. Read-only definitions reject
component writes.

## State kinds

| Kind         | Value                           | Consumers                 |
| ------------ | ------------------------------- | ------------------------- |
| `text`       | Bounded string                  | Text fields/displays      |
| `number`     | Finite number                   | Numeric controls/displays |
| `boolean`    | Boolean                         | Checkbox, Toggle          |
| `tableRows`  | Unique row IDs and scalar cells | DataTable                 |
| `selection`  | Unique row IDs                  | DataTable                 |
| `sorting`    | Unique column/direction rules   | DataTable                 |
| `filters`    | Typed column/filter rules       | DataTable                 |
| `pagination` | Page index and bounded size     | DataTable                 |

GENSTATE-005: Each kind has a separate schema module and colocated tests. Cell values
are JSON scalars. Arbitrary objects, markup execution, CSS, and code selectors are
rejected. Derived values require a closed selector contract.

## DataTable transitions

GENSTATE-006: Rows, selection, sorting, filters, and pagination bind separately.
Read-only data can coexist with writable view state. View interactions cannot implicitly
edit row values.

GENSTATE-007: Sorting or filtering resets the page index. Pagination preserves
selection. Dataset replacement removes selected IDs that no longer exist and clamps the
current page. Sort and filter columns must exist and have compatible value types.

GENSTATE-008: Compound transitions validate first and commit atomically through a Jotai
write atom. Invalid events leave all involved states unchanged. Subscribers cannot
observe a new filter with stale pagination.

GENSTATE-009: Event adapters emit typed values such as row IDs, sort descriptors, or
page requests. They never pass browser events into application state.

GENSTATE-014: DataTable columns declare stable keys and scalar types. Each table
requires five distinct binding keys. Read-only view bindings disable their editing
controls. Editable sorting/filtering requires writable pagination because those
transitions reset the page. Row refresh is a privileged controller operation and
atomically prunes selection and clamps pagination, including read-only view state.

GENSTATE-015: Controllers expose a reactive Jotai snapshot and typed operations. Rows
are filtered, stably sorted, and then paginated. Selection uses source row IDs and
survives page, sorting, and filter changes. Null values sort last. Sorting uses
deterministic scalar comparison; text filters use case-insensitive containment.

GENSTATE-016: Active binding and table constraints also validate host writes. A host
cannot bypass table consistency by writing one key directly. Invalid proposals have no
effects; a host can use an atomic transaction or the controller refresh operation.
Constraint leases are released when a view or controller is disposed.

GENSTATE-017: Version `0.2` ships a portable JSON Schema separately from the `0.1`
schema. Freshness checks regenerate both from their Zod contracts. Independent JSON
Schema validation covers shape; semantic validation remains required for cross-state
references, permissions, uniqueness, and table relationships.

GENSTATE-018: Public snapshots and binding metadata are immutable. Query results cannot
be mutated to change a cached view without going through a validated state transition.
Type declarations expose read-only snapshots and arrays.

## Scope, permissions, and lifecycle

GENSTATE-010: Keys are unique within an application state scope. Separate apps, SSR
requests, and independent generative documents have isolated registries. Sharing a
registry is an explicit host operation.

GENSTATE-011: Initial values apply on creation. Re-rendering and theme changes preserve
edited values. Reset and state-definition migration are explicit validated operations.

GENSTATE-012: Registered host actions may update read-only datasets through a host API.
A document cannot grant itself host privileges. Every host update validates value types
and the resulting table/binding invariants.

GENSTATE-013: Unknown keys, wrong kinds, forbidden writes, invalid transitions, and
incompatible schema changes produce structured diagnostics. Misspelled references never
create new state implicitly.

## Acceptance

GENSTATE-019: Public examples compile against the shipped TypeScript API and have
colocated behavioral tests. Demonstrate two writers and a reader sharing a key,
read-only data refreshed by a registered host action, and complete DataTable state
definitions with separate row, selection, sort, filter, and pagination bindings.
Document the transition rules and distinguish definition access from binding mode.
Literal Badge transport uses the existing noninteractive adapter contract, including
closed icon/size choices, with no new state kind or callback capability. Source
traceability must distinguish adapter coverage from actual transport support.

GENSTATE-020: Nullable numeric fields use a distinct `nullableNumber` kind whose value
is a finite number or null. Preserve the existing finite `number` contract for numeric
displays and sliders. Empty editable fields remain genuinely empty in generative UI;
do not restore a previous number as a protocol workaround. All registry writes,
permissions, transactions, isolation and active property constraints still apply.

- Several readers and writers share one key reactively.
- Read-only displays cannot emit writes.
- Duplicate/missing keys, wrong kinds, and forbidden writes fail closed.
- Numeric and boolean controls preserve their logical value types.
- Table sorting, filtering, selection, paging, and refresh follow the rules.
- Invalid compound events leave the previous snapshot intact.
- Theme changes, SSR, hydration, and separate app stores preserve scopes.
- TSX and JSON use the same complete adapter contract.
- All state and binding modules have colocated tests and per-file 100% coverage.
