import { atom, useAtom } from 'jotai';
import {
  Button,
  ChatTool,
  Input,
  Section,
  Text,
  Toggle,
  VStack,
} from '@fastsprout/reacd';
import type { ChatToolProps } from '@fastsprout/reacd';

const statusAtom = atom<ChatToolProps['status']>('pending');
const openAtom = atom(false);
const disabledAtom = atom(false);
const outputAtom = atom('Example output only. No command is executed.');
const decisionAtom = atom('No example decision yet.');

export function ChatToolExample() {
  const [status, setStatus] = useAtom(statusAtom);
  const [open, setOpen] = useAtom(openAtom);
  const [disabled, setDisabled] = useAtom(disabledAtom);
  const [output, setOutput] = useAtom(outputAtom);
  const [decision, setDecision] = useAtom(decisionAtom);
  return (
    <Section title="Chat tool preview">
      <VStack>
        <Input label="Example tool output" value={output} onValueChange={setOutput} />
        <Toggle
          label="Protect tool actions"
          checked={disabled}
          onCheckedChange={setDisabled}
        />
        <Button label="Set example tool pending" onPress={() => setStatus('pending')} />
        <Button label="Run example tool" onPress={() => setStatus('running')} />
        <Button
          label="Request example tool approval"
          onPress={() => setStatus('approval')}
        />
        <Button label="Complete example tool" onPress={() => setStatus('success')} />
        <Button label="Fail example tool" onPress={() => setStatus('error')} />
        <ChatTool
          label="Example reference reader"
          status={status}
          open={open}
          onOpenChange={setOpen}
          output={output}
          disabled={disabled}
          onApprove={
            status === 'approval'
              ? () => {
                  setDecision('Approved example request.');
                  setStatus('success');
                }
              : undefined
          }
          onReject={
            status === 'approval'
              ? () => {
                  setDecision('Rejected example request.');
                  setStatus('error');
                }
              : undefined
          }
          onRetry={status === 'error' ? () => setStatus('pending') : undefined}
        />
        <Text>{decision}</Text>
      </VStack>
    </Section>
  );
}
