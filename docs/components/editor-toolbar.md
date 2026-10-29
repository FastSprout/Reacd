---
template: preview.html
reacd_preview: EditorToolbar
reacd_preview_height: 560
---

# EditorToolbar

Declare formatting commands inside the nearest Editor's toolbar slot. The adapter
resolves availability, active formatting and focus from that editor's private scope.

<!-- reacd-live-preview -->

```tsx
--8<-- "examples/editor-toolbar.tsx"
```

```tsx
<Editor
  label="Draft"
  value={document}
  onValueChange={setDocument}
  toolbar={
    <EditorToolbar
      label="Draft formatting"
      items={[
        { command: 'bold' },
        { command: 'italic' },
        { command: 'link', href: 'https://reacd.dev/' },
        { command: 'undo' },
        { command: 'redo' },
      ]}
    />
  }
/>
```

`label`, `items` and `disabled` are optional. Omitting items uses the engine's default
command set. A supplied list must be nonempty, bounded and unique by command. Each item
may set a label or disabled flag. A link command requires a validated safe href.

Supported commands include bold, italic, strike, underline, inline code, headings 1–3,
paragraph, bullet/numbered list, quote, code block, separator, link, removeLink, undo
and redo. A toolbar action operates on the editor's current native selection and
restores editing focus. Pressed states reflect active formatting. History actions
reflect current availability. Disabled/read-only editors lock their toolbar; explicit
toolbar or item disabled flags also prevent execution.

Place each toolbar in its intended Editor scope. Independent editors use independent
ports. An orphan toolbar renders a diagnostic. The public API contains logical command
data; private SDK editors, DOM refs, extension objects and arbitrary callbacks are not
accepted. Links and commands remain subject to the document's validated capabilities.

Optional generative EditorToolbar nodes contain only literal closed options. Their live
command scope comes from the containing rendered Editor; commands are not remote actions
or arbitrary state expressions. Normal selection stays private.

Run the compiled [EditorToolbar example](../examples/editor-toolbar.tsx) in the
component preview. It includes link/history commands and host-controlled toolbar
protection. See [Editor](editor.md) for the document and controlled-state contract.
