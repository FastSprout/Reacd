export const EDITOR_DRAG_POLICY = {
  scopeError: 'EditorDragHandle must be inside an Editor.',
  selectionError: 'Select an editor block before using EditorDragHandle.',
  unknownError: 'The editor block identifier does not exist in this document.',
  select: 'Select block',
  selectAndDrag: 'Select and drag block',
  up: 'Move up',
  down: 'Move down',
  instructions: 'Drag this control or use Move up and Move down to reorder the block.',
  fixedInstructions: 'Select this block. It has no permitted sibling moves.',
  protectedInstructions: 'Block actions are currently unavailable.',
  mimeType: 'application/x-reacd-editor-block',
  moveEffect: 'move',
} as const;
