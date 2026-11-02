import { atom, useAtom } from 'jotai';
import { Card, RadioGroup, Text } from '@fastsprout/reacd';

const planAtom = atom('personal');
const PLANS = [
  { value: 'personal', label: 'Personal', description: 'For your own projects.' },
  { value: 'team', label: 'Team', description: 'For working together.' },
];

export function MembershipCard() {
  const [plan, setPlan] = useAtom(planAtom);
  return (
    <Card label="Workspace plan">
      <Text role="subheadline">Find your workspace</Text>
      <RadioGroup
        label="Workspace plan"
        value={plan}
        items={PLANS}
        onValueChange={setPlan}
      />
      <Text role="caption">{`Selected plan: ${plan}`}</Text>
    </Card>
  );
}
