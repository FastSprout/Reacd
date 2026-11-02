import { atom, useAtom } from 'jotai';
import { ChatTool } from '@fastsprout/reacd';
import type { ChatToolProps } from '@fastsprout/reacd';

const openAtom = atom(false);
const statusAtom = atom<ChatToolProps['status']>('approval');

export function ChatToolExample() {
  const [open, setOpen] = useAtom(openAtom);
  const [status, setStatus] = useAtom(statusAtom);
  return (
    <ChatTool
      label="Sample project lookup"
      status={status}
      open={open}
      onOpenChange={setOpen}
      input="project: sample"
      output="This preview does not execute tools."
      onApprove={status === 'approval' ? () => setStatus('success') : undefined}
      onReject={status === 'approval' ? () => setStatus('error') : undefined}
      onRetry={status === 'error' ? () => setStatus('approval') : undefined}
    />
  );
}
