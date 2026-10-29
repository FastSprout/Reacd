---
template: preview.html
reacd_preview: EditorSuggestionMenu
reacd_preview_height: 560
---

# EditorSuggestionMenu

EditorSuggestionMenu connects a closed item catalog to the nearest Editor. Type `/` in
the editable document to filter results. Arrow keys select enabled options, Enter
applies the selected option and Escape closes the menu.

<!-- reacd-live-preview -->

```tsx
--8<-- "examples/editor-suggestion-menu.tsx"
```

The live preview uses an isolated Jotai document. Reset restores the empty paragraph;
the read-only switch protects the document and prevents menu actions. The direction
switch exercises the same component in both reading directions.

| Property   | Meaning                                         |
| ---------- | ----------------------------------------------- |
| `label`    | Required visible accessible menu name.          |
| `items`    | Ordered closed catalog, at most 100 entries.    |
| `disabled` | Prevent this menu from registering its trigger. |

Suggestion items carry a unique supported block command and a label. Commands are
paragraph, heading1/2/3, bulletList, orderedList, quote, codeBlock and separator. There
are no custom executable handlers or arbitrary extensions.

Filtering preserves catalog order and displays up to 42 results. Empty results remain
labelled and dismissible. Results occupy a bounded panel below the document instead of
exposing floating-position or styling settings. Native textbox focus remains in the
editor during keyboard and pointer selection.

Only one menu of each kind may register per editor. Orphan or duplicate registrations
show an actionable diagnostic. Read-only, disabled and hidden retained scopes cannot
apply a menu operation. Every edit follows the Editor's controlled document boundary;
schema validation does not establish browser layout correctness.
