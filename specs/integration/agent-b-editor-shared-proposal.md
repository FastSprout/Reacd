# Agent B: shared Editor integration proposal

Status: implemented in the isolated B copy; final combined acceptance pending.
Only A can merge these proposals into the combined catalog or mark entries Verified.
The root checkout remains untouched. Frozen component-owned prerequisites retain
separate manifests and must not be replaced from an older aggregate snapshot.

## Catalog and adapter registration

Add Editor, EditorToolbar, EditorDragHandle, EditorSuggestionMenu,
EditorMentionMenu and EditorEmojiMenu to ComponentCatalog and componentNames.
Re-export their own modules from the components barrel. Export the domain document,
block, inline, position, selection and atomic EditorEdit types from Editor; export
EditorToolbarItem and the Mention item/request/result DTOs from their own modules.

Compose editorEntries, editorDragHandleEntries and editorMenuEntries in the existing
shadcn registry. Preserve every A registry addition. Exhaustive fixtures must include
all six names in their valid nearest Editor scope; a toolbar alone is invalid.
The extracted adapter-structure-examples helper preserves existing FieldGroup/Tree
fixtures while keeping each maintained file within 300 lines.

## Optional generative transport

Add EditorNode<GenerativeNode> directly to the recursive union and use its recursive
schema factory. The visitor traverses the toolbar and optional auxiliary children;
binding collection delegates to editorNodeBindings. The value uses richDocument;
selection remains private metadata in transport 0.2.

Register the Toolbar, DragHandle and three menu literal leaves. AdditionalNodeView
mounts BoundEditor with rendered slots and routes menu leaves through the separate
EditorMenuNodeView. Checkbox and Slider dispatch moves from NodeView into the same
existing AdditionalNodeView without changing their binding behavior. This extraction
keeps the dispatch modules under the maintained-file limit.

Remote Mention lookup is a TSX-only capability in this transport version. JSON may
supply local literal items but cannot inject a network callback or serialized SDK.
Regenerate the exported schema from the merged source rather than replacing A's
larger generated schema with B's 101-component snapshot.

## Theme, examples and documentation

Import editor.css and editor-drag-handle.css in the trusted stylesheet. Named
EDITOR_LAYOUT values map through editorVariables into template variables. Preserve
A's template variables and styles. Editor containment uses the existing core padding
limit so maximum schema-valid spacing cannot force overflow in narrow containers.

Mount EditorExamples once under Content and data. It composes eight runnable closed
TSX previews: Editor, atomic controlled selection, Toolbar, DragHandle, the three
menus and remote Mention lookup. Preserve all A family mounts. Keep these technical
previews separate from the public inventory's accepted-entry count.

Add the six component references and Mention lookup reference to MkDocs navigation.
Internal specifications, ledgers and browser evidence remain outside docs/. No
publication or DNS change is part of this proposal.

## Dependencies and verification boundaries

Merge the five exact TipTap 3.32.1 production pins and their lock additions by intent.
The native SDK remains private to the adapter. Existing dependency versions and
integrities must remain intact; installation must use independent node_modules.

The final acceptance record will name full B unit/coverage, strict types, lint,
source policy, generated freshness, production build, package and browser evidence.
The Editor browser matrix covers native interaction, layout, block dragging,
remote lookup, startup recovery and maximum-spacing templates. Schema validation
alone is never evidence of correct browser layout or focus.

The final combined A+B source must also receive the requested independent Standards
and Spec reviews, corrections and complete gates. These snapshot proposals do not
replace that final acceptance and do not authorize any remote operation.
