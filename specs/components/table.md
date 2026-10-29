# Table

TABLE-006: The controller owns a leased external connection, observed with a stable
subscription and cached snapshot. Install and release compound constraints with the
subscription lifecycle. Connection failures hide controls. SSR reads a deterministic
initial snapshot without subscribing. Controller-local error state resets by model
identity rather than synchronous React state writes inside effects.

Status: approved curated API before implementation. Preserve existing static calls.

TABLE-001: Keep caption, string columns and string rows as the default static Table
contract. Add a discriminated mode: interactive contract with a complete controlled
model of typed columns, rows, selection, sorting, filters and pagination, plus optional
onModelChange. Reuse validated DataTable model/query/rendering behavior rather than
introduce a second sorting/filter engine. Static and interactive contracts reject
unknown properties and malformed row/column relationships.

TABLE-002: Interactive Table validates the full model before rendering. Selection,
sorting, filtering and pagination request one complete next model from the host.
Sorting/filtering reset page index atomically. Host rejection leaves the previous model
visible. Missing callback, readOnly or disabled prevents mutation; controls must
communicate protected state. No application cell renderers, HTML, styles or arbitrary
table-engine options are allowed.

TABLE-003: Preserve the existing semantic table, scoped column headings, native
sorting/filter/selection/pagination controls and labelled local scroll region.
Loading/error/empty and retry behavior must be explicit. Long content, RTL and 200% text
must not cause page overflow. Independent tables must not leak constraints or Jotai
state across apps, datasets or SSR requests.

TABLE-004: Generative interactive Table reuses tableRows/selection/sorting/filters/
pagination state kinds and compound DataTable constraints. All referenced entries are
checked before controls render. Sorting/filtering commit pagination resets in the same
transaction; rows replacement reconciles selection and valid pagination. Read bindings
never acquire write privileges from another table.

TABLE-005: Acceptance covers both contracts, invalid types/ids/datasets, atomic host
transitions/rejection, shared and independent table constraints, protected controls,
query correctness, all states/retry, SSR/hydration and actual browser keyboard/form/
overflow behavior. Every owned runtime file requires 100% in all four coverage metrics.

Primary reference: Nuxt UI Table's official source and existing accepted reacd
DataTable. Virtual scrolling, arbitrary cell templates and external table engines are
not claimed.
