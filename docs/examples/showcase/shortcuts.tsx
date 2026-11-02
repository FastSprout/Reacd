import { atom, useAtom } from 'jotai';
import { Button, Card, HStack, Kbd, Text } from '@fastsprout/reacd';

const statusAtom = atom('Use Tab to move and Enter to activate.');

export function ShortcutsCard() {
  const [status, setStatus] = useAtom(statusAtom);
  return (
    <Card label="Shortcuts">
      <Text role="subheadline">Keyboard shortcuts</Text>
      <HStack>
        <Kbd value="Tab" label="Move between actions" />
        <Kbd value="Enter" label="Activate the focused action" />
      </HStack>
      <Button label="Save draft" onPress={() => setStatus('Draft saved locally.')} />
      <Button
        label="Reset draft"
        intent="secondary"
        onPress={() => setStatus('Draft reset.')}
      />
      <Text role="caption">{status}</Text>
    </Card>
  );
}
