import { ChatAttachmentExample } from '../../../docs/examples/chat-attachment.js';
import { ChatMessageExample } from '../../../docs/examples/chat-message.js';
import { ChatMessagesExample } from '../../../docs/examples/chat-messages.js';
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
