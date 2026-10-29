import type { z } from 'zod';
import type { chatToolSchema } from '../../schema/chat-tool/index.js';

export type ChatToolProps = z.infer<typeof chatToolSchema>;
