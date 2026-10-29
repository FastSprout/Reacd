import type { z } from 'zod';
import type { chatAttachmentSchema } from '../../schema/chat-attachment/index.js';

export type ChatAttachmentProps = z.infer<typeof chatAttachmentSchema>;
