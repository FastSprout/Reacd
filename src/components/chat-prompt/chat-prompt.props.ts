import type { z } from 'zod';
import type { chatPromptSchema } from '../../schema/chat-prompt/index.js';

export type ChatPromptProps = z.infer<typeof chatPromptSchema>;
