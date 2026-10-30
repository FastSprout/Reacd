import { atom, useAtom } from 'jotai';
import { Badge, Toggle, VStack } from '@fastsprout/reacd';
const warningAtom = atom(false);
const largeAtom = atom(false);
export function BadgeExample() {
  const [warning, setWarning] = useAtom(warningAtom);
  const [large, setLarge] = useAtom(largeAtom);
  return (
    <VStack>
      <Badge
        label={warning ? 'Review required' : 'Ready'}
        intent={warning ? 'danger' : 'primary'}
        leadingIcon={warning ? 'warning' : 'check'}
        size={large ? 'large' : 'small'}
      />
      <Toggle
        label="Badge warning state"
        checked={warning}
        onCheckedChange={setWarning}
      />
      <Toggle label="Large badge" checked={large} onCheckedChange={setLarge} />
    </VStack>
  );
}
