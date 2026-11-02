import { atom, useAtom } from 'jotai';
import { Card, Input } from '@fastsprout/reacd';

const emailAtom = atom('');
const searchAtom = atom('');

export function FieldsCard() {
  const [email, setEmail] = useAtom(emailAtom);
  const [search, setSearch] = useAtom(searchAtom);
  return (
    <Card label="Text fields">
      <Input
        label="Your email"
        inputType="email"
        value={email}
        placeholder="you@example.com"
        onValueChange={setEmail}
        description="This sample never sends your email."
      />
      <Input
        label="Search components"
        inputType="search"
        value={search}
        placeholder="Find a component..."
        onValueChange={setSearch}
      />
    </Card>
  );
}
