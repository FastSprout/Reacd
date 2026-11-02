import { atom, useAtom } from 'jotai';
import { Accordion, Input, Text, VStack } from '@fastsprout/reacd';

const openAtom = atom<readonly string[]>([]);
const noteAtom = atom('');
export function AccordionExample() {
  const [open, setOpen] = useAtom(openAtom);
  const [note, setNote] = useAtom(noteAtom);
  return (
    <VStack>
      <Accordion
        label="Accordion example"
        value={open}
        onValueChange={setOpen}
        mode="multiple"
        retainContent
        items={[
          {
            value: 'overview',
            label: 'Example overview',
            content: (
              <Text>Review the release checklist, task owners and delivery dates.</Text>
            ),
          },
          {
            value: 'notes',
            label: 'Example notes',
            content: <Input label="Panel note" value={note} onValueChange={setNote} />,
          },
          {
            value: 'disabled',
            label: 'Disabled section',
            disabled: true,
            content: <Text>Unavailable example</Text>,
          },
        ]}
      />
    </VStack>
  );
}
