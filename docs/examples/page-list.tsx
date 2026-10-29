import { atom, useAtom } from 'jotai';
import { Input, PageList, Text, Toggle, VStack } from 'reacd';

const divideAtom = atom(false);
const queryAtom = atom('');

export function PageListExample() {
  const [divide, setDivide] = useAtom(divideAtom);
  const [query, setQuery] = useAtom(queryAtom);
  return (
    <VStack>
      <Toggle label="Divide page list" checked={divide} onCheckedChange={setDivide} />
      <PageList divide={divide}>
        <Text>First declaration</Text>
        <Input label="Page list query" value={query} onValueChange={setQuery} />
        <Text>Last declaration</Text>
      </PageList>
    </VStack>
  );
}
