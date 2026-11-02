import { atom, useAtom } from 'jotai';
import { Card, Text, User } from '@fastsprout/reacd';

const profileAtom = atom('Choose a profile.');
const PEOPLE = [
  { name: 'Avery Morgan', description: 'Product designer', fallback: 'AM' },
  { name: 'Sam Rivera', description: 'Frontend engineer', fallback: 'SR' },
];

export function PeopleCard() {
  const [profile, setProfile] = useAtom(profileAtom);
  return (
    <Card label="People">
      <Text role="subheadline">People</Text>
      {PEOPLE.map((person) => (
        <User
          key={person.name}
          name={person.name}
          description={person.description}
          avatar={{ fallback: person.fallback }}
          onPress={() => setProfile(`Selected profile: ${person.name}.`)}
        />
      ))}
      <Text role="caption">{profile}</Text>
    </Card>
  );
}
