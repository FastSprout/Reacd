import { atom, useAtom } from 'jotai';
import { Button, Card, Progress, Text } from '@fastsprout/reacd';

const progressAtom = atom(65);
const COMPLETION_STEP = 5;
const COMPLETE = 100;

export function ProgressCard() {
  const [progress, setProgress] = useAtom(progressAtom);
  return (
    <Card label="Project progress">
      <Text role="subheadline">Website launch</Text>
      <Text>{`${progress}% complete`}</Text>
      <Progress label="Launch checklist" value={progress} max={COMPLETE} />
      <Button
        label="Complete a task"
        disabled={progress === COMPLETE}
        onPress={() => setProgress(Math.min(COMPLETE, progress + COMPLETION_STEP))}
      />
    </Card>
  );
}
