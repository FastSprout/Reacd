import { atom, useAtom } from 'jotai';
import { FooterColumns, Input, Section, Text, Toggle, VStack } from '@fastsprout/reacd';

const disabledAtom = atom(false);
const messageAtom = atom('No footer action selected.');
const noteAtom = atom('A note retained when the template changes.');

export function FooterColumnsExample() {
  const [disabled, setDisabled] = useAtom(disabledAtom);
  const [message, setMessage] = useAtom(messageAtom);
  const [note, setNote] = useAtom(noteAtom);
  return (
    <Section title="Footer columns preview">
      <VStack>
        <Toggle
          label="Disable footer action"
          checked={disabled}
          onCheckedChange={setDisabled}
        />
        <FooterColumns
          label="Sample footer resources"
          left={<Text>Sample resource directory</Text>}
          right={<Input label="Footer note" value={note} onValueChange={setNote} />}
          columns={[
            {
              key: 'resources',
              label: 'Resources',
              children: [
                { key: 'home', label: 'Workbench home', href: '/', active: true },
                {
                  key: 'action',
                  label: 'Select resource locally',
                  disabled,
                  onPress: () => setMessage('Resource selected locally.'),
                },
              ],
            },
            {
              key: 'help',
              label: 'Help',
              children: [
                {
                  key: 'support',
                  label: 'Select support locally',
                  onPress: () => setMessage('Support selected locally.'),
                },
              ],
            },
          ]}
        />
        <Text>{message}</Text>
      </VStack>
    </Section>
  );
}
