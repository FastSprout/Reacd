import { atom, useAtom } from 'jotai';
import { Button, Chip, Text, VStack } from '@fastsprout/reacd';

const unreadAtom = atom(true);

export function ChipExample() {
  const [unread, setUnread] = useAtom(unreadAtom);

  return (
    <VStack>
      <Chip label="Unread messages" text={3} show={unread}>
        <Button label="Open messages" onPress={() => setUnread(false)} />
      </Chip>
      <Text>{unread ? 'You have 3 unread messages.' : 'You are all caught up.'}</Text>
    </VStack>
  );
}
