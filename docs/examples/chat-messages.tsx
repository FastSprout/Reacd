import { atom, useAtom } from 'jotai';
import { Button, ChatMessages, VStack } from '@fastsprout/reacd';
import type { ChatMessagesProps } from '@fastsprout/reacd';

const messagesAtom = atom<ChatMessagesProps['messages']>([]);

export function ChatMessagesExample() {
  const [messages, setMessages] = useAtom(messagesAtom);
  return (
    <VStack>
      <ChatMessages label="Sample conversation" messages={messages} />
      <Button
        label="Add local reply"
        onPress={() =>
          setMessages([
            ...messages,
            {
              id: `reply-${messages.length + 1}`,
              author: 'Sample assistant',
              role: 'assistant',
              content: 'This reply was added locally.',
            },
          ])
        }
      />
    </VStack>
  );
}
