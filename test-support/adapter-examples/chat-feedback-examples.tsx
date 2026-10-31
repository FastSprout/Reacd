import { ChatReasoning } from '../../src/components/chat-reasoning/index.js';
import { ChatTool } from '../../src/components/chat-tool/index.js';
import { ChatShimmer } from '../../src/components/chat-shimmer/index.js';

export const CHAT_FEEDBACK_EXAMPLES = {
  ChatReasoning: (
    <ChatReasoning text="Example summary" open={false} onOpenChange={() => undefined} />
  ),
  ChatTool: (
    <ChatTool
      label="Example tool"
      status="pending"
      open={false}
      onOpenChange={() => undefined}
    />
  ),
  ChatShimmer: <ChatShimmer text="Example progress" />,
} as const;
