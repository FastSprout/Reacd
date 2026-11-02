import { atom, useAtom } from 'jotai';
import { Button, ChatShimmer, VStack } from '@fastsprout/reacd';

const activeAtom = atom(true);

export function ChatShimmerExample() {
  const [active, setActive] = useAtom(activeAtom);
  return (
    <VStack>
      <ChatShimmer
        active={active}
        text={active ? 'Processing a sample task.' : 'Sample task finished.'}
      />
      <Button label="Finish sample task" onPress={() => setActive(false)} />
    </VStack>
  );
}
