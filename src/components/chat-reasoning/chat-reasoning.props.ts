import type { z } from 'zod';
import type { chatReasoningSchema } from '../../schema/chat-reasoning/index.js';

export type ChatReasoningProps = z.infer<typeof chatReasoningSchema>;
