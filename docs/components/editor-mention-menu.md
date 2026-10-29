---
template: preview.html
reacd_preview: EditorMentionMenu
reacd_preview_height: 560
---

# EditorMentionMenu

EditorMentionMenu connects a closed item catalog to the nearest Editor. Type `@` in the
editable document to filter results. Arrow keys select enabled options, Enter applies
the selected option and Escape closes the menu.

<!-- reacd-live-preview -->

```tsx
--8<-- "examples/editor-mention-menu.tsx"
```

The live preview uses an isolated Jotai document. Reset restores the empty paragraph;
the read-only switch protects the document and prevents menu actions. The direction
switch exercises the same component in both reading directions.

| Property   | Meaning                                         |
| ---------- | ----------------------------------------------- |
| `label`    | Required visible accessible menu name.          |
| `items`    | Ordered closed catalog, at most 100 entries.    |
| `disabled` | Prevent this menu from registering its trigger. |

Mention items carry a unique bounded id, label and optional disabled intent. Selection
replaces the typed range with an owned mention atom and a trailing space.

Filtering preserves catalog order and displays up to 42 results. Empty results remain
labelled and dismissible. Results occupy a bounded panel below the document instead of
exposing floating-position or styling settings. Native textbox focus remains in the
editor during keyboard and pointer selection.

Only one menu of each kind may register per editor. Orphan or duplicate registrations
show an actionable diagnostic. Read-only, disabled and hidden retained scopes cannot
apply a menu operation. Every edit follows the Editor's controlled document boundary;
schema validation does not establish browser layout correctness.

## Host lookup mode

Use `results` and `onQueryChange` instead of `items` for asynchronous host lookup. The
callback receives one frozen `{key, query}` request. Echo both fields in a result with
`status: "loading"`, `status: "ready"` plus `items`, or `status: "error"` plus nonempty
plain `error` text. Pass `null` before the first request. The runtime does not perform
network requests or execute query expressions.

Ready results are authoritative, including fuzzy matches whose labels do not contain the
query. Both correlation fields must match; stale responses retain already accepted
current results or leave the menu loading. A new query/open cycle uses a new scoped key,
including when the same query is typed again later. Disabled/hidden/read-only scopes do
not request data. No request fires during rendering, SSR or startup.

[Try the local response simulator](editor-mention-lookup.md) to inspect loading, errors,
empty results and stale-response protection without a backend. Optional JSON transport
accepts literal local catalogs only; callback-based host lookup is a TSX capability.
