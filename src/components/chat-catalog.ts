import type { ChatAttachmentProps } from './chat-attachment/index.js';
import type { ChatMessageProps } from './chat-message/index.js';
import type { ChatMessagesProps } from './chat-messages/index.js';
import type { ChatReasoningProps } from './chat-reasoning/index.js';
import type { ChatToolProps } from './chat-tool/index.js';
import type { ChatShimmerProps } from './chat-shimmer/index.js';

export interface ChatCatalog {
  ChatPrompt: ChatPromptProps;
  ChatPromptSubmit: ChatPromptSubmitProps;
  ChatPalette: ChatPaletteProps;
  ChatAttachment: ChatAttachmentProps;
  ChatMessage: ChatMessageProps;
  ChatMessages: ChatMessagesProps;
  ChatReasoning: ChatReasoningProps;
  ChatTool: ChatToolProps;
  ChatShimmer: ChatShimmerProps;
}
import type { ChatPromptProps } from './chat-prompt/index.js';
import type { ChatPromptSubmitProps } from './chat-prompt-submit/index.js';
import type { ChatPaletteProps } from './chat-palette/index.js';
