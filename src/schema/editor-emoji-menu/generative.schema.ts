import { z } from 'zod';
import { editorEmojiMenuSchema } from './editor-emoji-menu.schema.js';

export const editorEmojiMenuNodeSchema = editorEmojiMenuSchema
  .unwrap()
  .extend({ type: z.literal('EditorEmojiMenu') })
  .readonly();
