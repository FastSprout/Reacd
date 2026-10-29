import type { z } from 'zod';
import type { editorDragHandleSchema } from '../../schema/editor-drag-handle/index.js';
export type EditorDragHandleProps = z.infer<typeof editorDragHandleSchema>;
