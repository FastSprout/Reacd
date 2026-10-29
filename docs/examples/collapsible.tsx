import { atom, useAtom } from 'jotai';
import { Button, Collapsible, Input, Select, Text, Toggle, VStack } from 'reacd';

const openAtom = atom(false);
const nestedAtom = atom(false);
const noteAtom = atom('');
const roleAtom = atom('reader');
export function CollapsibleExample() {
  const [open, setOpen] = useAtom(openAtom);
  const [nested, setNested] = useAtom(nestedAtom);
  const [note, setNote] = useAtom(noteAtom);
  const [role, setRole] = useAtom(roleAtom);
  return (
    <VStack>
      <Toggle label="Show advanced settings" checked={open} onCheckedChange={setOpen} />
      <Text>{open ? 'Disclosure is open' : 'Disclosure is closed'}</Text>
      <Collapsible
        label="Advanced settings"
        open={open}
        onOpenChange={setOpen}
        retainContent
      >
        <VStack>
          <Input label="Disclosure note" value={note} onValueChange={setNote} />
          <Select
            label="Disclosure role"
            value={role}
            onValueChange={setRole}
            items={[
              { value: 'reader', label: 'Reader' },
              { value: 'editor', label: 'Editor' },
            ]}
          />
          <Collapsible
            label="Nested settings"
            open={nested}
            onOpenChange={setNested}
            retainContent
          >
            <Text>
              {'Long nested identifier: ' + 'configuration_value_'.repeat(24)}
            </Text>
          </Collapsible>
        </VStack>
      </Collapsible>
      <Collapsible
        label="Unavailable settings"
        open={false}
        onOpenChange={setOpen}
        disabled
      >
        <Text>Unavailable example content</Text>
      </Collapsible>
      <Collapsible
        label="External disclosure"
        open={open}
        onOpenChange={setOpen}
        showTrigger={false}
      >
        <Text>
          This panel shares the external toggle without adding another trigger.
        </Text>
      </Collapsible>
      <Button
        label="Reset disclosure note"
        intent="secondary"
        onPress={() => setNote('')}
      />
    </VStack>
  );
}
