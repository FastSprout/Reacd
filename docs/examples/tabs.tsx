import { atom, useAtom } from 'jotai';
import { Input, Tabs, Text, Toggle, VStack } from '@fastsprout/reacd';

const selectedAtom = atom('account');
const aliasAtom = atom('');
const manualAtom = atom(false);
const verticalAtom = atom(false);

export function TabsExample() {
  const [selected, setSelected] = useAtom(selectedAtom);
  const [alias, setAlias] = useAtom(aliasAtom);
  const [manual, setManual] = useAtom(manualAtom);
  const [vertical, setVertical] = useAtom(verticalAtom);
  return (
    <VStack>
      <Toggle
        label="Manual tab activation"
        checked={manual}
        onCheckedChange={setManual}
      />
      <Toggle label="Vertical tabs" checked={vertical} onCheckedChange={setVertical} />
      <Tabs
        label="Account settings"
        value={selected}
        onValueChange={setSelected}
        orientation={vertical ? 'vertical' : 'horizontal'}
        activationMode={manual ? 'manual' : 'automatic'}
        items={[
          {
            value: 'account',
            label: 'Account preferences',
            content: (
              <Input label="Account alias" value={alias} onValueChange={setAlias} />
            ),
          },
          {
            value: 'restricted',
            label: 'Restricted settings: ' + 'permission_scope_'.repeat(8),
            disabled: true,
          },
          {
            value: 'billing',
            label: 'Billing preferences',
            content: (
              <Text>Billing settings are separate from account preferences.</Text>
            ),
          },
        ]}
      />
    </VStack>
  );
}
