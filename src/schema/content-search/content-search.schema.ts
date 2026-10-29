import { z } from 'zod';
import { commandPaletteSchema } from '../command-palette/command-palette.schema.js';
import { labelSchema, booleanChangeSchema } from '../shared/values.js';
import { childrenSchema } from '../shared/children.js';

export const contentSearchSchema = commandPaletteSchema.safeExtend({
  title: labelSchema,
  description: labelSchema.optional(),
  open: z.boolean(),
  onOpenChange: booleanChangeSchema,
  triggerLabel: labelSchema.optional(),
  closeLabel: labelSchema.optional(),
  closeOnSelect: z.boolean().optional(),
  footer: childrenSchema,
});
