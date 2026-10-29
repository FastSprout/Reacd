import type { z } from 'zod';
import type { codeBlockSchema } from '../../schema/code-block/code-block.schema.js';

export type CodeBlockProps = z.infer<typeof codeBlockSchema>;
