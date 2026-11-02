import { atom, useAtom } from 'jotai';
import { Card, Input, Tabs, Text } from '@fastsprout/reacd';

const tabAtom = atom('profile');
const nameAtom = atom('');

export function AccountCard() {
  const [tab, setTab] = useAtom(tabAtom);
  const [name, setName] = useAtom(nameAtom);
  return (
    <Card label="Your account">
      <Text role="subheadline">Your account</Text>
      <Tabs
        label="Sample account settings"
        value={tab}
        onValueChange={setTab}
        items={[
          {
            value: 'profile',
            label: 'Profile',
            content: (
              <Input label="Display name" value={name} onValueChange={setName} />
            ),
          },
          {
            value: 'security',
            label: 'Security',
            content: <Text>No account or password is sent from this preview.</Text>,
          },
        ]}
      />
    </Card>
  );
}
