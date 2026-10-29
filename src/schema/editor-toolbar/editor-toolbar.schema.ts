import { z } from 'zod';
import {
  EDITOR_STANDARD_COMMANDS,
  EDITOR_TOOLBAR_POLICY,
} from '../../core/editor-commands.js';
import { linkSchema } from '../link/link.schema.js';
import { labelSchema } from '../shared/values.js';

const options = { label: labelSchema.optional(), disabled: z.boolean().optional() };
export const editorToolbarItemSchema = z
  .discriminatedUnion('command', [
    z.strictObject({ command: z.enum(EDITOR_STANDARD_COMMANDS), ...options }),
    z.strictObject({
      command: z.literal('link'),
      href: linkSchema.shape.href,
      ...options,
    }),
  ])
  .readonly();
export const editorToolbarSchema = z
  .strictObject({
    ...options,
    items: z
      .array(editorToolbarItemSchema)
      .min(EDITOR_TOOLBAR_POLICY.minItems)
      .max(EDITOR_TOOLBAR_POLICY.maxItems)
      .refine(
        (items) => new Set(items.map((item) => item.command)).size === items.length,
        'Editor toolbar commands must be unique.',
      )
      .readonly()
      .optional(),
  })
  .readonly();
