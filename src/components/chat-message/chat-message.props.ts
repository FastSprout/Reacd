import type { z } from 'zod';
import type { chatMessageSchema } from '../../schema/chat-message/index.js';

export type ChatMessageProps = z.infer<typeof chatMessageSchema>;
