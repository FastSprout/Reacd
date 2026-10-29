import type { Editor } from '@tiptap/core';
import type { EditorProps } from '../../../components/editor/index.js';
import type { EditorPort } from '../../../renderer/editor/editor-context.js';
import { editorBlockMoves, moveEditorBlock } from '../../../core/editor-reorder.js';
import { publishEditorDocument } from './publish-edit.js';
import { selectedSdkBlockId } from '../editor-sdk/structural-selection.js';
import { selectSdkBlock } from '../editor-sdk/select-block.js';
import type { EditorDragSession } from './drag-session.js';
import {
  canRunSdkCommand,
  runSdkCommand,
  sdkCommandActive,
} from '../editor-sdk/commands.js';
import { sdkSelectionToDomain } from '../editor-sdk/selection-mapping.js';

export function createEditorPort(
  editor: Editor | null,
  properties: EditorProps,
  disabled: boolean,
  drag: EditorDragSession,
): EditorPort {
  const available = !disabled && editor !== null && !editor.isDestroyed;
  const selection =
    editor === null
      ? undefined
      : sdkSelectionToDomain(editor.state.doc, editor.state.selection);
  return {
    document: properties.value,
    selection,
    selectedBlockId:
      (editor === null ? undefined : selectedSdkBlockId(editor.state.selection)) ??
      selection?.focus.blockId,
    disabled: !available,
    active: (command) => available && sdkCommandActive(editor, command),
    available: (command) => available && canRunSdkCommand(editor, command),
    execute: (command) => {
      if (available) runSdkCommand(editor, command);
    },
    blockMoves: (id) => editorBlockMoves(properties.value, id),
    selectBlock: (id) => {
      if (!available) return;
      selectSdkBlock(editor, id);
    },
    moveBlock: (id, direction) => {
      if (!available) return;
      const moved = moveEditorBlock(properties.value, id, direction);
      if (moved.success)
        publishEditorDocument(properties, moved.data, selection);
    },
    beginBlockDrag: (id) => available && drag.begin(properties.value, id),
    cancelBlockDrag: () => drag.cancel(),
  };
}
