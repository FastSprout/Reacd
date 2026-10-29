import { z } from 'zod';
import { EDITOR_MENU_POLICY } from '../../core/editor-menu-policy.js';
import { EDITOR_POLICY } from '../../core/editor-policy.js';
import { labelSchema } from '../shared/values.js';

export const editorEmojiItemSchema = z
  .strictObject({
    name: labelSchema,
    value: z.string().min(1).max(EDITOR_POLICY.maxEmojiLength),
    label: labelSchema,
    disabled: z.boolean().optional(),
  })
  .readonly();
export const editorEmojiMenuSchema = z
  .strictObject({
    label: labelSchema,
    disabled: z.boolean().optional(),
    items: z
      .array(editorEmojiItemSchema)
      .max(EDITOR_MENU_POLICY.maxItems)
      .refine(
        (items) => new Set(items.map((item) => item.name)).size === items.length,
        'Emoji names must be unique.',
      )
      .readonly(),
  })
  .readonly();
