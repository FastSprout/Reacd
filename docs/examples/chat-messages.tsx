import { atom, useAtom } from 'jotai';
import { App, Button, ChatMessages, Input, Section, Toggle, VStack } from 'reacd';
import type { ChatMessagesProps } from 'reacd';

const messagesAtom = atom<ChatMessagesProps['messages']>([]);
const statusAtom = atom<ChatMessagesProps['status']>('ready');
const contentAtom = atom('An example transcript message.');
const rtlAtom = atom(false);
const followAtom = atom(true);

export function ChatMessagesExample() {
  const [messages, setMessages] = useAtom(messagesAtom);
  const [status, setStatus] = useAtom(statusAtom);
  const [content, setContent] = useAtom(contentAtom);
  const [rtl, setRtl] = useAtom(rtlAtom);
  const [followLatest, setFollowLatest] = useAtom(followAtom);
  return (
    <Section title="Chat transcript preview">
      <VStack>
        <Input
          label="Transcript message text"
          value={content}
          onValueChange={setContent}
        />
        <Toggle
          label="Right to left conversation"
          checked={rtl}
          onCheckedChange={setRtl}
        />
        <Toggle
          label="Follow latest conversation message"
          checked={followLatest}
          onCheckedChange={setFollowLatest}
        />
        <Button
          label="Add example message"
          onPress={() =>
            setMessages([
              ...messages,
              {
                id: `message-${crypto.randomUUID()}`,
                author: 'Example assistant',
                role: 'assistant',
                content,
              },
            ])
          }
        />
        <Button label="Clear example conversation" onPress={() => setMessages([])} />
        <Button
          label="Wait for example response"
          onPress={() => setStatus('submitted')}
        />
        <Button
          label="Stream example conversation"
          onPress={() => setStatus('streaming')}
        />
        <Button label="Fail example conversation" onPress={() => setStatus('error')} />
        <App direction={rtl ? 'rtl' : 'ltr'}>
          <ChatMessages
            label="Example conversation"
            messages={messages}
            status={status}
            followLatest={followLatest}
            error="Simulated connection failure."
            onRetry={() => setStatus('ready')}
          />
        </App>
      </VStack>
    </Section>
  );
}
