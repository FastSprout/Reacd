import { z } from 'zod';
import { editorToolbarSchema } from './editor-toolbar.schema.js';

export const editorToolbarNodeSchema = editorToolbarSchema
  .unwrap()
  .extend({ type: z.literal('EditorToolbar') })
  .readonly();
