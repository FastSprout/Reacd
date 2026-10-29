import { z } from 'zod';
import { editorDragHandlePropertiesSchema } from './editor-drag-handle.schema.js';
export const editorDragHandleNodeSchema = editorDragHandlePropertiesSchema
  .extend({
    type: z.literal('EditorDragHandle'),
  })
  .readonly();
