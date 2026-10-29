import { z } from 'zod';
import { editorSuggestionMenuSchema } from './editor-suggestion-menu.schema.js';

export const editorSuggestionMenuNodeSchema = editorSuggestionMenuSchema
  .unwrap()
  .extend({ type: z.literal('EditorSuggestionMenu') })
  .readonly();
