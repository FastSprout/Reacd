import { atom, useAtom } from 'jotai';
import { Button, Card, PageColumns, Text, VStack } from '@fastsprout/reacd';

const selectedAtom = atom('None');
const ITEMS = [
  { key: 'first', title: 'First', body: 'Declarations describe information.' },
  { key: 'second', title: 'Second', body: 'Templates supply appearance. '.repeat(6) },
  { key: 'third', title: 'Third', body: 'Schemas validate external data.' },
  {
    key: 'fourth',
    title: 'Fourth',
    body: 'Adapters own trusted native rendering. '.repeat(4),
  },
  { key: 'fifth', title: 'Fifth', body: 'Application state belongs to Jotai.' },
  { key: 'sixth', title: 'Sixth', body: 'Browser checks verify actual geometry.' },
];

export function PageColumnsExample() {
  const [selected, setSelected] = useAtom(selectedAtom);
  return (
    <VStack>
      <PageColumns>
        {ITEMS.map((item) => (
          <Card key={item.key}>
            <Text role="subheadline">{item.title}</Text>
            <Text>{item.body}</Text>
            <Button
              label={`Inspect flow ${item.key}`}
              onPress={() => setSelected(item.title)}
            />
          </Card>
        ))}
      </PageColumns>
      <Text>{`Selected flow: ${selected}`}</Text>
    </VStack>
  );
}
