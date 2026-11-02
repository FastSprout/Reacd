import { atom, useAtom } from 'jotai';
import { Button, Card, Empty, Text } from '@fastsprout/reacd';

const createdAtom = atom(false);

export function EmptyExample() {
  const [created, setCreated] = useAtom(createdAtom);

  if (created) {
    return (
      <Card>
        <Text role="headline">Website redesign</Text>
        <Text>Your first project is ready.</Text>
      </Card>
    );
  }

  return (
    <Empty
      title="No projects yet"
      description="Create a project to organize your team's work."
      actions={<Button label="Create project" onPress={() => setCreated(true)} />}
    />
  );
}
