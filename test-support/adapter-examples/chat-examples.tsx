import { ChatAttachment } from '../../src/components/chat-attachment/index.js';
import { ChatMessage } from '../../src/components/chat-message/index.js';
import { ChatMessages } from '../../src/components/chat-messages/index.js';

export const CHAT_EXAMPLES = {
  ChatAttachment: <ChatAttachment name="Example.txt" mediaType="text/plain" />,
  ChatMessage: (
    <ChatMessage
      id="example"
      author="Example assistant"
      role="assistant"
      content="Example response"
    />
  ),
  ChatMessages: <ChatMessages label="Example transcript" messages={[]} />,
} as const;
