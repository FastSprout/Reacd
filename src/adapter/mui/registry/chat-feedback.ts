import { renderEntry } from
  '@fastsprout/reacd/adapter-runtime/renderer/contracts/render-entry.js';
import { chatReasoningSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/chat-reasoning/index.js';
import { chatToolSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/chat-tool/index.js';
import { chatShimmerSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/chat-shimmer/index.js';
import { MuiChatReasoning } from '../chat-reasoning/chat-reasoning.adapter.js';
import { MuiChatTool } from '../chat-tool/chat-tool.adapter.js';
import { MuiChatShimmer } from '../chat-shimmer/chat-shimmer.adapter.js';

export const chatFeedbackEntries = {
  ChatReasoning: renderEntry('ChatReasoning', chatReasoningSchema, MuiChatReasoning),
  ChatTool: renderEntry('ChatTool', chatToolSchema, MuiChatTool),
  ChatShimmer: renderEntry('ChatShimmer', chatShimmerSchema, MuiChatShimmer),
} as const;
