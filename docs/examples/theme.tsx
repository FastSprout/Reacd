import { atom, useAtom } from 'jotai';
import { Theme, Button, Text, VStack, templates } from 'reacd';

const countAtom = atom(0);

export function ThemeExample() {
  const [count, setCount] = useAtom(countAtom);
  return (
    <Theme
      template={templates['erp-compact']}
      defaults={{
        Text: { role: 'caption' },
        Button: { intent: 'secondary' },
      }}
    >
      <VStack>
        <Text>Scoped compact appearance</Text>
        <Text role="body">{`Scoped actions: ${count}`}</Text>
        <Button label="Run scoped action" onPress={() => setCount(count + 1)} />
      </VStack>
    </Theme>
  );
}
