import type { z } from 'zod';
import type { chatPromptSubmitSchema } from '../../schema/chat-prompt-submit/index.js';

export type ChatPromptSubmitProps = z.infer<typeof chatPromptSubmitSchema>;
