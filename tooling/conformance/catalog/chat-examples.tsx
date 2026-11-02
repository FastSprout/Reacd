import { ChatAttachmentExample } from '../fixtures/chat-attachment.js';
import { ChatMessageExample } from '../fixtures/chat-message.js';
import { ChatMessagesExample } from '../fixtures/chat-messages.js';
import { VStack } from '@fastsprout/reacd';

export function ChatExamples() {
  return (
    <VStack>
      <ChatAttachmentExample />
      <ChatMessageExample />
      <ChatMessagesExample />
    </VStack>
  );
}
