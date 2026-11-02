import { AvatarGroup, Card, Text } from '@fastsprout/reacd';

export function ContributorsCard() {
  return (
    <Card label="Contributors">
      <Text role="subheadline">Contributors</Text>
      <AvatarGroup
        label="Project contributors"
        max={3}
        items={[
          { id: 'avery', name: 'Avery Morgan' },
          { id: 'sam', name: 'Sam Rivera' },
          { id: 'jordan', name: 'Jordan Lee' },
          { id: 'casey', name: 'Casey Taylor' },
        ]}
      />
    </Card>
  );
}
