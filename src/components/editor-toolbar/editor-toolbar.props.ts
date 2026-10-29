import type { z } from 'zod';
import type {
  editorToolbarSchema,
  editorToolbarItemSchema,
} from '../../schema/editor-toolbar/index.js';

export type EditorToolbarProps = z.infer<typeof editorToolbarSchema>;
export type EditorToolbarItem = z.infer<typeof editorToolbarItemSchema>;
