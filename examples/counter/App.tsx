import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { atom, useAtom } from 'jotai';
import { Button, HStack, Page, ReacdProvider, Text, VStack } from '@fastsprout/reacd';

const countAtom = atom(0);

function Counter() {
  const [count, setCount] = useAtom(countAtom);
  return (
    <Page title="Counter" subtitle="State belongs to this application instance.">
      <VStack>
        <Text role="headline">{`Count: ${count}`}</Text>
        <HStack>
          <Button label="Increment" onPress={() => setCount((value) => value + 1)} />
          <Button label="Reset" onPress={() => setCount(0)} />
        </HStack>
      </VStack>
    </Page>
  );
}

export function App() {
  return (
    <ReacdProvider adapter={shadcnAdapter}>
      <Counter />
    </ReacdProvider>
  );
}
