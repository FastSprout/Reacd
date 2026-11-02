import { atom, useAtom } from 'jotai';
import { ChatPromptSubmit, Text, VStack } from '@fastsprout/reacd';
import type { ChatPromptSubmitProps } from '@fastsprout/reacd';

const statusAtom = atom<ChatPromptSubmitProps['status']>('ready');

export function ChatPromptSubmitExample() {
  const [status, setStatus] = useAtom(statusAtom);
  return (
    <VStack>
      <Text>These sample actions run locally: send, stop, then retry.</Text>
      <ChatPromptSubmit
        status={status}
        onSubmit={() => setStatus('streaming')}
        onStop={() => setStatus('error')}
        onRetry={() => setStatus('ready')}
      />
    </VStack>
  );
}
