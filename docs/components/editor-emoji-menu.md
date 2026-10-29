---
template: preview.html
reacd_preview: EditorEmojiMenu
reacd_preview_height: 560
---

# EditorEmojiMenu

EditorEmojiMenu connects a closed item catalog to the nearest Editor. Type `:` in the
editable document to filter results. Arrow keys select enabled options, Enter applies
the selected option and Escape closes the menu.

<!-- reacd-live-preview -->

```tsx
--8<-- "examples/editor-emoji-menu.tsx"
```

The live preview uses an isolated Jotai document. Reset restores the empty paragraph;
the read-only switch protects the document and prevents menu actions. The direction
switch exercises the same component in both reading directions.

| Property   | Meaning                                         |
| ---------- | ----------------------------------------------- |
| `label`    | Required visible accessible menu name.          |
| `items`    | Ordered closed catalog, at most 100 entries.    |
| `disabled` | Prevent this menu from registering its trigger. |

Emoji items carry a unique name, bounded Unicode value, label and optional disabled
intent. Selection inserts an accessible owned atom and a trailing space. Image URLs,
HTML and executable rendering callbacks are unsupported.

Filtering preserves catalog order and displays up to 42 results. Empty results remain
labelled and dismissible. Results occupy a bounded panel below the document instead of
exposing floating-position or styling settings. Native textbox focus remains in the
editor during keyboard and pointer selection.

Only one menu of each kind may register per editor. Orphan or duplicate registrations
show an actionable diagnostic. Read-only, disabled and hidden retained scopes cannot
apply a menu operation. Every edit follows the Editor's controlled document boundary;
schema validation does not establish browser layout correctness.
