import type { z } from 'zod';
import type { editorEmojiMenuSchema } from '../../schema/editor-emoji-menu/index.js';

export type EditorEmojiMenuProps = z.infer<typeof editorEmojiMenuSchema>;
