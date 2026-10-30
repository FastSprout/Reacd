import { atom, useAtom } from 'jotai';
import { Button, Card, PageGrid, Text, VStack } from '@fastsprout/reacd';

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

export function PageGridExample() {
  const [selected, setSelected] = useAtom(selectedAtom);
  return (
    <VStack>
      <PageGrid>
        {ITEMS.map((item) => (
          <Card key={item.key}>
            <Text role="subheadline">{item.title}</Text>
            <Text>{item.body}</Text>
            <Button
              label={`Inspect grid ${item.key}`}
              onPress={() => setSelected(item.title)}
            />
          </Card>
        ))}
      </PageGrid>
      <Text>{`Selected grid: ${selected}`}</Text>
    </VStack>
  );
}
