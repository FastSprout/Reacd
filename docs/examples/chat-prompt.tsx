import { atom, useAtom } from 'jotai';
import { Button, ChatPrompt, Section, Text, VStack } from 'reacd';
import type { ChatPromptProps } from 'reacd';

const draftAtom = atom('');
const statusAtom = atom<ChatPromptProps['status']>('ready');
const reportAtom = atom(true);
const sentAtom = atom('No request yet.');

export function ChatPromptExample() {
  const [draft, setDraft] = useAtom(draftAtom);
  const [status, setStatus] = useAtom(statusAtom);
  const [report, setReport] = useAtom(reportAtom);
  const [sent, setSent] = useAtom(sentAtom);
  return (
    <Section title="Chat prompt preview">
      <VStack>
        <ChatPrompt
          label="Example message"
          value={draft}
          onValueChange={setDraft}
          status={status}
          description="Enter sends; Shift+Enter starts a new line."
          placeholder="Write an example message"
          error="Example connection failed."
          attachments={
            report
              ? [{ id: 'report', name: 'Example report', mediaType: 'text/plain' }]
              : []
          }
          onRemoveAttachment={() => setReport(false)}
          onSubmit={(value) => {
            setSent(`Requested: ${value}`);
            setStatus('streaming');
          }}
          onStop={() => setStatus('ready')}
          onRetry={() => setStatus('ready')}
        />
        <Button label="Simulate response failure" onPress={() => setStatus('error')} />
        <Text>{sent}</Text>
      </VStack>
    </Section>
  );
}
