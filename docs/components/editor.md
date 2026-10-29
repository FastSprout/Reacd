---
template: preview.html
reacd_preview: Editor
reacd_preview_height: 560
---

# Editor

Edit a controlled rich document through a labelled, theme-adapted editor. Declare the
view in TSX and keep its document in application state.

<!-- reacd-live-preview -->

```tsx
--8<-- "examples/editor.tsx"
```

```tsx
import { atom, useAtom } from 'jotai';
import { Editor, EditorToolbar } from 'reacd';
import type { EditorDocument } from 'reacd';

const initial: EditorDocument = {
  version: 1,
  blocks: [{ type: 'paragraph', id: 'intro', content: [] }],
};
const documentAtom = atom(initial);

export function Notes() {
  const [value, setValue] = useAtom(documentAtom);
  return (
    <Editor
      label="Notes"
      value={value}
      onValueChange={setValue}
      toolbar={<EditorToolbar />}
    />
  );
}
```

`label`, `value` and `onValueChange(document)` are required. Optional `description` and
`placeholder` provide guidance. `toolbar` and `children` accept safe reacd components.
The host decides whether to accept each proposed document. Declining an edit restores
the last controlled value. Replacing the document from the host updates the view without
reporting a new user edit. Initialization and server rendering do not publish edits.

Documents use version 1 and stable, unique block ids. Supported blocks include
paragraphs, headings 1–3, quotes, bullet/numbered lists, code blocks and separators.
Inline content supports text, the closed formatting marks, safe links, mentions, emoji
and hard breaks. An empty editable document contains a paragraph with an empty content
array. Preserve ids when replacing existing blocks. Document shape, links, identity and
budgets are validated before entering the editor or application state.

`readOnly` retains the visible document and accessible reading surface while preventing
edits and formatting. `disabled` also prevents interaction. Neither flag changes the
host's document. Normal selection remains private. TSX callers can control it using
`value`, `selection` and `onEditChange(edit)`. Each atomic edit contains the validated
document and its matching logical block-id/offset selection. Store both fields in one
Jotai atom so accepted structural changes cannot retain a stale selection. The
controlled variant uses `onEditChange` and does not accept `onValueChange` or
`onSelectionChange`.

Inside `FormField`, inherited disabled safety applies even with `disabled={false}` on
Editor. Group descriptions and errors join the editor's accessible guidance; the group
owns its error announcement. Loading or disabled AuthForm also protects its editor
children. This does not add Editor name, required or FormData properties.

Server rendering provides a labelled static preview. The native editor initializes after
hydration. Application code uses no native HTML, CSS, SDK objects or DOM refs. The
adapter owns wrapping, selection, paste handling, focus and theme styling. No arbitrary
extension, style, class or raw HTML property is accepted.

Optional generative transport binds `value` to richDocument state with explicit
read/readWrite access. Read bindings force read-only behavior. Toolbar and auxiliary
slots are recursively validated. Selection is not transported. Use independent state
registries for independent apps and SSR requests. Schema validation is separate from
native interaction and browser verification.

Run the compiled [Editor example](../examples/editor.tsx) in the component preview. It
shows a shared reader, host replacement, declined writes, protection and scoped RTL. See
[EditorToolbar](editor-toolbar.md) for closed formatting commands.
