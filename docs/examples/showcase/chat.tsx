import { Card, Text } from '@fastsprout/reacd';
import { ChatPromptExample } from '../chat-prompt.js';

export function ChatCard() {
  return (
    <Card label="Chat">
      <Text role="subheadline">Chat composer</Text>
      <ChatPromptExample />
    </Card>
  );
}
