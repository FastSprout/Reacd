import { renderEntry } from '../../../renderer/contracts/render-entry.js';
import { chatAttachmentSchema } from '../../../schema/chat-attachment/index.js';
import { chatMessageSchema } from '../../../schema/chat-message/index.js';
import { chatMessagesSchema } from '../../../schema/chat-messages/index.js';
import { ShadcnChatAttachment } from '../chat-attachment/chat-attachment.adapter.js';
import { ShadcnChatMessage } from '../chat-message/chat-message.adapter.js';
import { ShadcnChatMessages } from '../chat-messages/chat-messages.adapter.js';

export const chatEntries = {
  ChatAttachment: renderEntry(
    'ChatAttachment',
    chatAttachmentSchema,
    ShadcnChatAttachment,
  ),
  ChatMessage: renderEntry('ChatMessage', chatMessageSchema, ShadcnChatMessage),
  ChatMessages: renderEntry('ChatMessages', chatMessagesSchema, ShadcnChatMessages),
} as const;
