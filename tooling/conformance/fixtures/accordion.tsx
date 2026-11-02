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
              <Text>
                {'Content stays within its panel. ' + 'long_identifier_'.repeat(24)}
              </Text>
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
