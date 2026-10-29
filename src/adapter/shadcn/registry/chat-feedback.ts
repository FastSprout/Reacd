import { renderEntry } from '../../../renderer/contracts/render-entry.js';
import { chatReasoningSchema } from '../../../schema/chat-reasoning/index.js';
import { chatToolSchema } from '../../../schema/chat-tool/index.js';
import { chatShimmerSchema } from '../../../schema/chat-shimmer/index.js';
import { ShadcnChatReasoning } from '../chat-reasoning/chat-reasoning.adapter.js';
import { ShadcnChatTool } from '../chat-tool/chat-tool.adapter.js';
import { ShadcnChatShimmer } from '../chat-shimmer/chat-shimmer.adapter.js';

export const chatFeedbackEntries = {
  ChatReasoning: renderEntry('ChatReasoning', chatReasoningSchema, ShadcnChatReasoning),
  ChatTool: renderEntry('ChatTool', chatToolSchema, ShadcnChatTool),
  ChatShimmer: renderEntry('ChatShimmer', chatShimmerSchema, ShadcnChatShimmer),
} as const;
