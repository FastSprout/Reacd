import { z } from 'zod';
import { editorMentionMenuLocalPropertiesSchema } from
  './editor-mention-menu.schema.js';

export const editorMentionMenuNodeSchema = editorMentionMenuLocalPropertiesSchema
  .extend({ type: z.literal('EditorMentionMenu') }).readonly();
