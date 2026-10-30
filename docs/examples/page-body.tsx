import { atom, useAtom } from 'jotai';
import { Input, PageBody, Text } from '@fastsprout/reacd';

const queryAtom = atom('');

export function PageBodyExample() {
  const [query, setQuery] = useAtom(queryAtom);
  return (
    <PageBody>
      <Text>PageBody supplies block spacing without another main landmark.</Text>
      <Input label="Page body query" value={query} onValueChange={setQuery} />
    </PageBody>
  );
}
