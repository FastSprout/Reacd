---
template: preview.html
reacd_preview: EditorDragHandle
reacd_preview_height: 560
---

# EditorDragHandle

EditorDragHandle selects and reorders logical blocks inside an Editor scope. Native
pointer dragging and explicit Move up/Move down controls share the editor's validated
reorder rules.

<!-- reacd-live-preview -->

```tsx
--8<-- "examples/editor-drag-handle.tsx"
```

```tsx
<Editor
  label="Document"
  value={document}
  onValueChange={setDocument}
  toolbar={<EditorDragHandle label="Review block" blockId="review" />}
/>
```

label is required. Optional blockId targets a stable structural identifier, including
nested blocks and list items. Without it, the handle follows the current selected block.
Use an explicit identifier when controls must be present before a selection. Missing
scope, missing selection and unknown identifiers produce diagnostics.

The selection button becomes a native drag affordance when sibling movement is allowed.
It remains selectable when no move is possible. Move up and Move down provide keyboard
alternatives. Boundary and protected actions are disabled. No operation reparents a
block or crosses its sibling array, and a list item keeps its required leading
paragraph.

The host owns the document and optional controlled selection, typically through isolated
Jotai state. Each successful reorder requests one complete document. Rejected changes
preserve the previous value. Stable identifiers keep logical selection positions valid.
The engine handles pointer targets and SDK updates; applications pass no DOM refs,
coordinates, events or editor instances. When controlling selection, use one EditorEdit
atom and onEditChange for the complete value/selection pair. Private-selection editors
use value/onValueChange instead.

Native sessions end on drop/cancel, Escape, unmount, target changes or protection.
Platforms without native dragging can use the same keyboard move controls. The component
exposes no general drag framework or arbitrary drag payload API.

The compiled live example shows a fixed Review target, controlled order, protection,
host rejection and restoration. Optional generative declarations use the same closed
properties inside Editor; no extra state kind or executable callback is needed.
