import { atom, useAtom } from 'jotai';
import { Button, Card, ProgressGroup, Text } from '@fastsprout/reacd';

const SAVINGS_TARGET = 10_000;
const RETIREMENT_SAVED = 6_500;
const CONTRIBUTION = 100;
const estateAtom = atom(3_200);

export function SavingsCard() {
  const [estate, setEstate] = useAtom(estateAtom);
  const estateTarget = SAVINGS_TARGET - RETIREMENT_SAVED;
  return (
    <Card label="Savings targets">
      <Text role="subheadline">Savings targets</Text>
      <Text role="caption">Allocate a $10,000 savings goal.</Text>
      <ProgressGroup
        label="Savings allocation"
        max={SAVINGS_TARGET}
        items={[
          { id: 'retirement', label: 'Retirement', value: RETIREMENT_SAVED },
          { id: 'estate', label: 'Real estate', value: estate },
        ]}
      />
      <Button
        label="Contribute to savings"
        disabled={estate === estateTarget}
        onPress={() => setEstate(Math.min(estateTarget, estate + CONTRIBUTION))}
      />
    </Card>
  );
}
