import { atom, useAtom } from 'jotai';
import { ChatReasoning } from '@fastsprout/reacd';

const openAtom = atom(false);

export function ChatReasoningExample() {
  const [open, setOpen] = useAtom(openAtom);
  return (
    <ChatReasoning
      open={open}
      onOpenChange={setOpen}
      text="Sample summary: check the component contract, then validate its input."
    />
  );
}
