import { z } from 'zod';
import { EDITOR_MENU_POLICY } from '../../core/editor-menu-policy.js';
import { labelSchema } from '../shared/values.js';
import { stateKeySchema } from '../state/shared/definition.js';

export const editorMentionItemSchema = z
  .strictObject({
    id: stateKeySchema,
    label: labelSchema,
    disabled: z.boolean().optional(),
  })
  .readonly();
export const editorMentionItemsSchema = z
  .array(editorMentionItemSchema)
  .max(EDITOR_MENU_POLICY.maxItems)
  .refine(
    (items) => new Set(items.map((item) => item.id)).size === items.length,
    'Mention ids must be unique.',
  )
  .readonly();
export type EditorMentionItem = z.infer<typeof editorMentionItemSchema>;
