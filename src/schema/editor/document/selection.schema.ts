import { z } from 'zod';
import type { EditorDocument } from '../../../core/editor-document.js';
import { EDITOR_POLICY } from '../../../core/editor-policy.js';
import {
  editorPositionExists,
  editorTextLengths,
} from '../../../core/editor-selection.js';
import { stateKeySchema } from '../../state/shared/definition.js';

export const editorPositionSchema = z
  .strictObject({
    blockId: stateKeySchema,
    offset: z.number().int().min(0).max(EDITOR_POLICY.maxCharacters),
  })
  .readonly();

export const editorSelectionValueSchema = z
  .strictObject({
    anchor: editorPositionSchema,
    focus: editorPositionSchema,
  })
  .readonly();

export function editorSelectionSchema(document: EditorDocument) {
  const lengths = editorTextLengths(document);
  return editorSelectionValueSchema.refine(
    (selection) =>
      editorPositionExists(lengths, selection.anchor) &&
      editorPositionExists(lengths, selection.focus),
    'Editor selection must resolve to editable blocks and valid logical offsets.',
  );
}
