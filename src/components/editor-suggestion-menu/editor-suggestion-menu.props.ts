import type { z } from 'zod';
import type {
  editorSuggestionMenuSchema,
} from '../../schema/editor-suggestion-menu/index.js';

export type EditorSuggestionMenuProps = z.infer<typeof editorSuggestionMenuSchema>;
