import { atom, useAtom } from 'jotai';
import { Button, ChatMessage, Input, Section, Text, VStack } from 'reacd';
import type { ChatMessageProps } from 'reacd';

const textAtom = atom('This is an editable example response.');
const statusAtom = atom<ChatMessageProps['status']>('ready');
const savedAtom = atom(false);

export function ChatMessageExample() {
  const [content, setContent] = useAtom(textAtom);
  const [status, setStatus] = useAtom(statusAtom);
  const [saved, setSaved] = useAtom(savedAtom);
  return (
    <Section title="Chat message preview">
      <VStack>
        <Input label="Example response" value={content} onValueChange={setContent} />
        <Button
          label="Stream example response"
          onPress={() => setStatus('streaming')}
        />
        <Button label="Fail example response" onPress={() => setStatus('error')} />
        <Button label="Finish example response" onPress={() => setStatus('ready')} />
        <ChatMessage
          id="example-response"
          author="Example assistant"
          role="assistant"
          content={content}
          status={status}
          error="Simulated interruption."
          actions={[
            {
              id: 'save',
              label: 'Save example response',
              onPress: () => setSaved(true),
            },
          ]}
        />
        <Text>
          {saved ? 'Example response saved.' : 'Example response is not saved.'}
        </Text>
      </VStack>
    </Section>
  );
}
