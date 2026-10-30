import { atom, useAtom } from 'jotai';
import {
  App,
  Button,
  Card,
  ScrollArea,
  Section,
  Text,
  Toggle,
  VStack,
} from '@fastsprout/reacd';

const horizontalAtom = atom(false);
const rtlAtom = atom(false);
const openedAtom = atom('No record opened.');
const RECORDS = ['Architecture', 'Components', 'State', 'Adapters', 'Rendering'];
export function ScrollAreaExample() {
  const [horizontal, setHorizontal] = useAtom(horizontalAtom);
  const [rtl, setRtl] = useAtom(rtlAtom);
  const [opened, setOpened] = useAtom(openedAtom);
  return (
    <Section title="Scrollable records preview">
      <VStack>
        <Toggle
          label="Horizontal records"
          checked={horizontal}
          onCheckedChange={setHorizontal}
        />
        <Toggle label="Right to left records" checked={rtl} onCheckedChange={setRtl} />
        <App direction={rtl ? 'rtl' : 'ltr'}>
          <ScrollArea
            label="Reference records"
            extent="small"
            orientation={horizontal ? 'horizontal' : 'vertical'}
          >
            {RECORDS.map((record) => (
              <Card key={record}>
                <Text role="subheadline">{record}</Text>
                <Text>
                  Read the reference while keeping the surrounding page stable.
                </Text>
                <Button
                  label={`Open ${record}`}
                  onPress={() => setOpened(`Opened ${record}.`)}
                />
              </Card>
            ))}
          </ScrollArea>
        </App>
        <Text>{opened}</Text>
      </VStack>
    </Section>
  );
}
