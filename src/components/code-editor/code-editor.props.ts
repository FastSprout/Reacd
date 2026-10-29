import type { z } from 'zod';
import type { codeEditorSchema } from '../../schema/code-editor/code-editor.schema.js';

export type CodeEditorProps = z.infer<typeof codeEditorSchema>;
