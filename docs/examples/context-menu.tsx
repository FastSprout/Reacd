import { atom, useAtom } from 'jotai';
import { ContextMenu, Section, Text, VStack } from '@fastsprout/reacd';
const openAtom = atom(false);
const archivedAtom = atom(false);
const confirmedAtom = atom(false);
const pinnedAtom = atom(false);
const densityAtom = atom('comfortable');
const copiedAtom = atom(false);
export function ContextMenuExample() {
  const [open, setOpen] = useAtom(openAtom);
  const [archived, setArchived] = useAtom(archivedAtom);
  const [confirmed, setConfirmed] = useAtom(confirmedAtom);
  const [pinned, setPinned] = useAtom(pinnedAtom);
  const [density, setDensity] = useAtom(densityAtom);
  const [copied, setCopied] = useAtom(copiedAtom);
  return (
    <Section title="ContextMenu preview">
      <VStack>
        <ContextMenu
          label="Sample record context"
          open={open}
          onOpenChange={setOpen}
          items={[
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
              ],
            },
            {
              type: 'action',
              key: 'archive',
              label: 'Archive sample record',
              intent: 'danger',
              onPress: () => setArchived(true),
            },
            {
              type: 'action',
              key: 'confirm',
              label: 'Confirm sample record',
              closeOnSelect: false,
              onPress: () => setConfirmed(true),
            },
          ]}
        >
          <Text>
            Right-click, long-press, or use the context-menu key on this record.
          </Text>
        </ContextMenu>
        <Text>{pinned ? 'Record is pinned.' : 'Record is not pinned.'}</Text>
        <Text>{`Density: ${density}`}</Text>
        <Text>
          {copied ? 'Record identifier copied locally.' : 'Identifier not copied.'}
        </Text>
        <Text>
          {archived ? 'Sample record archived locally.' : 'Sample record is active.'}
        </Text>
        <Text>
          {confirmed ? 'Sample record confirmed locally.' : 'Awaiting confirmation.'}
        </Text>
      </VStack>
    </Section>
  );
}
