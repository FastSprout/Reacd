import { renderEntry } from
  '@fastsprout/reacd/adapter-runtime/renderer/contracts/render-entry.js';
import { chatAttachmentSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/chat-attachment/chat-attachment.schema.js';
import { chatMessageSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/chat-message/chat-message.schema.js';
import { chatMessagesSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/chat-messages/chat-messages.schema.js';
import { chatPaletteSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/chat-palette/chat-palette.schema.js';
import { chatPromptSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/chat-prompt/chat-prompt.schema.js';
import { chatPromptSubmitSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/chat-prompt-submit/index.js';
import { chatReasoningSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/chat-reasoning/chat-reasoning.schema.js';
import { chatShimmerSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/chat-shimmer/chat-shimmer.schema.js';
import { chatToolSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/chat-tool/chat-tool.schema.js';
import { ShadcnChatAttachment } from '../chat-attachment/chat-attachment.adapter.js';
import { ShadcnChatMessage } from '../chat-message/chat-message.adapter.js';
import { ShadcnChatMessages } from '../chat-messages/chat-messages.adapter.js';
import { ShadcnChatPalette } from '../chat-palette/chat-palette.adapter.js';
import { ShadcnChatPrompt } from '../chat-prompt/chat-prompt.adapter.js';
import { ShadcnChatPromptSubmit } from
  '../chat-prompt-submit/chat-prompt-submit.adapter.js';
import { ShadcnChatReasoning } from '../chat-reasoning/chat-reasoning.adapter.js';
import { ShadcnChatShimmer } from '../chat-shimmer/chat-shimmer.adapter.js';
import { ShadcnChatTool } from '../chat-tool/chat-tool.adapter.js';

export const nativeChatEntries = {
  ChatAttachment: renderEntry(
    'ChatAttachment',
    chatAttachmentSchema,
    ShadcnChatAttachment,
  ),
  ChatMessage: renderEntry('ChatMessage', chatMessageSchema, ShadcnChatMessage),
  ChatMessages: renderEntry('ChatMessages', chatMessagesSchema, ShadcnChatMessages),
  ChatPalette: renderEntry('ChatPalette', chatPaletteSchema, ShadcnChatPalette),
  ChatPrompt: renderEntry('ChatPrompt', chatPromptSchema, ShadcnChatPrompt),
  ChatPromptSubmit: renderEntry(
    'ChatPromptSubmit',
    chatPromptSubmitSchema,
    ShadcnChatPromptSubmit,
  ),
  ChatReasoning: renderEntry('ChatReasoning', chatReasoningSchema, ShadcnChatReasoning),
  ChatShimmer: renderEntry('ChatShimmer', chatShimmerSchema, ShadcnChatShimmer),
  ChatTool: renderEntry('ChatTool', chatToolSchema, ShadcnChatTool),
};
