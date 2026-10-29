import { atom, useAtom } from 'jotai';
import { ChatPromptSubmit, Section, Text, VStack } from 'reacd';
import type { ChatPromptSubmitProps } from 'reacd';

const statusAtom = atom<ChatPromptSubmitProps['status']>('ready');

export function ChatPromptSubmitExample() {
  const [status, setStatus] = useAtom(statusAtom);
  return (
    <Section title="Chat submit preview">
      <VStack>
        <Text>These local actions demonstrate the host-owned request lifecycle.</Text>
        <ChatPromptSubmit
          status={status}
          onSubmit={() => setStatus('streaming')}
          onStop={() => setStatus('error')}
          onRetry={() => setStatus('ready')}
        />
      </VStack>
    </Section>
  );
}
