import { atom, useAtom } from 'jotai';
import { ChatShimmer, Input, Section, Toggle, VStack } from '@fastsprout/reacd';

const textAtom = atom('Processing an example request.');
const activeAtom = atom(true);

export function ChatShimmerExample() {
  const [text, setText] = useAtom(textAtom);
  const [active, setActive] = useAtom(activeAtom);
  return (
    <Section title="Chat shimmer preview">
      <VStack>
        <Input label="Example progress text" value={text} onValueChange={setText} />
        <Toggle
          label="Animate example status"
          checked={active}
          onCheckedChange={setActive}
        />
        <ChatShimmer
          text={text.trim() === '' ? 'Example progress' : text}
          active={active}
        />
      </VStack>
    </Section>
  );
}
