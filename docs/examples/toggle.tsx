import { atom, useAtom } from 'jotai';
import { Text, Toggle, VStack } from 'reacd';

const enabledAtom = atom(false);

export function ToggleExample() {
  const [enabled, setEnabled] = useAtom(enabledAtom);
  return (
    <VStack>
      <Toggle label="Email summaries" checked={enabled} onCheckedChange={setEnabled} />
      <Text>{`Email summaries are ${enabled ? 'enabled' : 'disabled'}.`}</Text>
    </VStack>
  );
}
