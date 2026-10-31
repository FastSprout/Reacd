import { renderEntry } from
  '@fastsprout/reacd/adapter-runtime/renderer/contracts/render-entry.js';
import { chatAttachmentSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/chat-attachment/index.js';
import { chatMessageSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/chat-message/index.js';
import { chatMessagesSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/chat-messages/index.js';
import { MuiChatAttachment } from '../chat-attachment/chat-attachment.adapter.js';
import { MuiChatMessage } from '../chat-message/chat-message.adapter.js';
import { MuiChatMessages } from '../chat-messages/chat-messages.adapter.js';

export const chatEntries = {
  ChatAttachment: renderEntry(
    'ChatAttachment',
    chatAttachmentSchema,
    MuiChatAttachment,
  ),
  ChatMessage: renderEntry('ChatMessage', chatMessageSchema, MuiChatMessage),
  ChatMessages: renderEntry('ChatMessages', chatMessagesSchema, MuiChatMessages),
} as const;
