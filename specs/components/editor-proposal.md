# Editor family proposal

Status: proposed; not an accepted implementation. Existing CodeEditor remains a
compatibility component. Scope: Editor, EditorToolbar, EditorDragHandle,
EditorSuggestionMenu, EditorMentionMenu and EditorEmojiMenu.

## Closed application contract

Editor accepts label, a controlled rich document value, onValueChange(document),
optional selection/onSelectionChange, placeholder, readOnly, disabled and safe toolbar
or auxiliary slots. No HTML string, CSS, DOM ref, SDK instance, arbitrary extension,
render callback or command expression enters public props or generative transport.

The versioned rich document uses stable block ids and a closed vocabulary: paragraph,
heading with allowed levels, quote, ordered/unordered list, code block and separator.
Inline nodes are text with closed bold/italic/strike/code marks, safe links, explicit
mention ids/labels and emoji text. Every collection, depth, text length and identifier
has a named core budget checked before conversion or allocation. Images/uploads and
arbitrary embedded nodes are outside the first contract; they require separate specs.

Selection is a logical pair of block-id/text offsets, never a DOM or ProseMirror
position. Selection must resolve against the controlled document. An omitted selection
uses private editing metadata; a supplied selection remains host-controlled. Invalid
external documents or selections produce actionable diagnostics before editor startup.

## Six component responsibilities

- Editor owns the labelled rich text surface and scope, plain text fallback for SSR,
  safe document conversion, native input/paste handling and controlled reconciliation.
- EditorToolbar uses closed command ids and labels, exposes pressed/available state, and
  supports a named keyboard toolbar. Commands include marks, headings, paragraph, lists,
  quote, code block, separator, undo and redo. Link commands require safe URL data;
  arbitrary command callbacks are not a formatting escape hatch.
- EditorDragHandle exposes selected-block move and selection controls. Pointer drag and
  keyboard move-up/down share the same validated block reorder operation. Boundary moves
  are disabled. It cannot reparent nodes or mutate neighbouring editor scopes.
- EditorSuggestionMenu filters a host-provided closed command catalog on slash input.
  Arrow keys move selection, Enter applies, Escape dismisses, and empty results are
  explicit. It replaces only the active trigger range in its editor's selection.
- EditorMentionMenu uses bounded host items with stable id and label, optional query
  callbacks for asynchronous host lookup, and the same keyboard/trigger protections.
  Missing/loading/error results never create inert selectable entries.
- EditorEmojiMenu uses an explicit bounded emoji catalog. Its colon trigger inserts a
  validated inline emoji node, preserves surrounding text and returns editing focus.

Auxiliary components outside an Editor scope show diagnostics rather than dead controls.
Hidden portals, disabled/read-only scopes and IME composition cannot execute commands or
intercept unrelated Escape. Multiple editors remain isolated.

## Trusted implementation boundary

Propose a private TipTap/ProseMirror implementation for editing, selection, history and
composition. Before installing anything, agree on pinned compatible React, core, starter
kit, link/mention/suggestion and drag dependencies with the coordinator. Do not expose
SDK classes or generic extension arrays in the closed contract.

SDK output is unknown until validated and converted into the reacd document DTO.
Unsupported clipboard structure is normalized to supported content or plain text. The
controlled value remains authoritative after host rejection. An internal renderer
revision may trigger reconciliation, but application content and logical selection use
the host's isolated Jotai store. No editor instance is stored in serialized app state.

Private scope exposes logical selection, command availability and execute(command), with
an adapter-owned implementation. There is no reverse dependency from renderer to state
or adapter. Native DOM effects remain inside trusted adapter helpers.

## Optional generative transport

Add a richDocument state kind only after its budget and mutation invariants are
specified and reviewed. Editor value uses read/readWrite references; read mode disables
mutations. Optional logical selection can use its own declared state kind if accepted.
Toolbar/menu catalogs are literal safe DTOs with registered query/request keys where
needed. No inline code, HTML or unvalidated SDK JSON is interpreted. The recursive
visitor must validate every toolbar/auxiliary slot before mounting the editor.

## Acceptance order

1. Specify document/selection/commands and bounded conversion. Test malformed graphs,
   duplicate ids, unsupported nodes/marks, links, offset resolution and reorder rules.
2. Add controlled Editor and Toolbar with typing, paste, keyboard marks, undo/redo,
   rejected host edits, isolated stores, SSR/hydration and meaningful browser checks.
3. Add the three menus together using a shared private suggestion controller. Cover
   trigger replacement, IME, navigation, async response ordering, focus and empty/error.
4. Add DragHandle with pointer reorder and equivalent keyboard commands, independent
   editors and invalid drop protection. Verify themes, narrow/RTL/200% and focus.

Each small batch retains 100% per-file four-metric coverage and public TSX examples. The
catalog is not accepted merely because the components exist or schemas validate.

Primary references, retrieved locally 2026-10-29:

- https://ui.nuxt.com/docs/components/editor
- https://ui.nuxt.com/docs/components/editor-toolbar
- https://ui.nuxt.com/docs/components/editor-drag-handle
- https://ui.nuxt.com/docs/components/editor-suggestion-menu
- https://ui.nuxt.com/docs/components/editor-mention-menu
- https://ui.nuxt.com/docs/components/editor-emoji-menu

Nuxt supplies the family responsibilities and TipTap integration direction. The reacd
adaptation deliberately closes its HTML, extension and SDK-instance authoring surface.
