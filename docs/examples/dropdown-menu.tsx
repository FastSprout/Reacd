import { atom, useAtom } from 'jotai';
import { DropdownMenu, Section, Text, VStack } from 'reacd';
const openAtom = atom(false);
const pinnedAtom = atom(false);
const densityAtom = atom('comfortable');
const copiedAtom = atom(false);
export function DropdownMenuExample() {
  const [open, setOpen] = useAtom(openAtom);
  const [pinned, setPinned] = useAtom(pinnedAtom);
  const [density, setDensity] = useAtom(densityAtom);
  const [copied, setCopied] = useAtom(copiedAtom);
  return (
    <Section title="DropdownMenu preview">
      <VStack>
        <DropdownMenu
          label="Record actions"
          open={open}
          onOpenChange={setOpen}
          items={[
            { type: 'label', key: 'record', label: 'Current record' },
            {
              type: 'checkbox',
              key: 'pin',
              label: 'Pin record',
              checked: pinned,
              onCheckedChange: setPinned,
            },
            {
              type: 'radio',
              key: 'density',
              label: 'Density',
              value: density,
              onValueChange: setDensity,
              options: [
                { value: 'comfortable', label: 'Comfortable' },
                { value: 'compact', label: 'Compact' },
              ],
            },
            { type: 'separator', key: 'separator' },
            {
              type: 'submenu',
              key: 'share',
              label: 'Share',
              items: [
                {
                  type: 'action',
                  key: 'copy',
                  label: 'Copy record identifier',
                  onPress: () => setCopied(true),
                },
                {
                  type: 'link',
                  key: 'guide',
                  label: 'Read record guide',
                  href: '/#record-guide',
                  newWindow: true,
                },
              ],
            },
          ]}
        />
        <Text>{pinned ? 'Record is pinned.' : 'Record is not pinned.'}</Text>
        <Text>{`Density: ${density}`}</Text>
        <Text>
          {copied ? 'Record identifier copied locally.' : 'No action performed.'}
        </Text>
      </VStack>
    </Section>
  );
}
