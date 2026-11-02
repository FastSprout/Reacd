import { atom, useAtom } from 'jotai';
import { Button, Card, Progress, Text } from '@fastsprout/reacd';

const MONTHLY_GOAL = 100;
const GOAL_STEP = 5;
const goalAtom = atom(75);

export function RevenueCard() {
  const [goal, setGoal] = useAtom(goalAtom);
  return (
    <Card label="Revenue">
      <Text role="subheadline">Total revenue</Text>
      <Text role="display">$48,200</Text>
      <Text>{`Monthly goal: ${goal}%`}</Text>
      <Progress label="Monthly revenue goal" value={goal} max={MONTHLY_GOAL} />
      <Button
        label="Advance monthly goal"
        disabled={goal === MONTHLY_GOAL}
        onPress={() => setGoal(Math.min(MONTHLY_GOAL, goal + GOAL_STEP))}
      />
    </Card>
  );
}
