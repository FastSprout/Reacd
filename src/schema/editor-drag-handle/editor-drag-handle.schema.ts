import { z } from 'zod';
import { labelSchema } from '../shared/values.js';
import { stateKeySchema } from '../state/shared/definition.js';
export const editorDragHandlePropertiesSchema = z.strictObject({
  label: labelSchema,
  blockId: stateKeySchema.optional(),
  disabled: z.boolean().optional(),
});
export const editorDragHandleSchema = editorDragHandlePropertiesSchema.readonly();
