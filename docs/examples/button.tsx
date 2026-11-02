import { atom, useAtom } from 'jotai';
import { Button, Text, VStack } from '@fastsprout/reacd';
const countAtom = atom(0);

export function ButtonExample() {
  const [count, setCount] = useAtom(countAtom);
  return (
    <VStack>
      <Button label="Request export" onPress={() => setCount(count + 1)} />
      <Text>{`Export requests: ${count}`}</Text>
    </VStack>
  );
}
