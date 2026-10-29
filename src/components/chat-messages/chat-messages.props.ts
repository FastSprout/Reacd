import type { z } from 'zod';
import type { chatMessagesSchema } from '../../schema/chat-messages/index.js';

export type ChatMessagesProps = z.infer<typeof chatMessagesSchema>;
