import { atom, useAtom } from 'jotai';
import { ChatPrompt, Text, VStack } from '@fastsprout/reacd';

const draftAtom = atom('');
const sentAtom = atom('');

export function ChatPromptExample() {
  const [draft, setDraft] = useAtom(draftAtom);
  const [sent, setSent] = useAtom(sentAtom);
  return (
    <VStack>
      <ChatPrompt
        label="Message"
        value={draft}
        onValueChange={setDraft}
        onSubmit={setSent}
        description="Enter sends; Shift+Enter adds a line."
      />
      <Text>{sent ? `Last sent: ${sent}` : 'No messages sent.'}</Text>
    </VStack>
  );
}
