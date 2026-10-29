import { z } from 'zod';
import {
  EDITOR_MENU_POLICY,
  EDITOR_SUGGESTION_COMMANDS,
} from '../../core/editor-menu-policy.js';
import { labelSchema } from '../shared/values.js';

export const editorSuggestionItemSchema = z
  .strictObject({
    command: z.enum(EDITOR_SUGGESTION_COMMANDS),
    label: labelSchema,
    disabled: z.boolean().optional(),
  })
  .readonly();
export const editorSuggestionMenuSchema = z
  .strictObject({
    label: labelSchema,
    disabled: z.boolean().optional(),
    items: z
      .array(editorSuggestionItemSchema)
      .max(EDITOR_MENU_POLICY.maxItems)
      .refine(
        (items) => new Set(items.map((item) => item.command)).size === items.length,
        'Suggestion commands must be unique.',
      )
      .readonly(),
  })
  .readonly();
