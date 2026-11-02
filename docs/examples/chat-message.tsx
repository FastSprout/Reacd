import { atom, useAtom } from 'jotai';
import { ChatMessage, Text, VStack } from '@fastsprout/reacd';

const savedAtom = atom(false);

export function ChatMessageExample() {
  const [saved, setSaved] = useAtom(savedAtom);
  return (
    <VStack>
      <ChatMessage
        id="sample-reply"
        author="Sample assistant"
        role="assistant"
        content="Your project notes are ready to review."
        actions={[
          { id: 'save', label: 'Save response', onPress: () => setSaved(true) },
        ]}
      />
      <Text>{saved ? 'Response saved.' : 'Save this sample response for later.'}</Text>
    </VStack>
  );
}
