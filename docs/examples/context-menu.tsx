import { atom, useAtom } from 'jotai';
import { ContextMenu, Section, Text, VStack } from 'reacd';
const openAtom = atom(false);
const archivedAtom = atom(false);
const confirmedAtom = atom(false);
export function ContextMenuExample() {
  const [open, setOpen] = useAtom(openAtom);
  const [archived, setArchived] = useAtom(archivedAtom);
  const [confirmed, setConfirmed] = useAtom(confirmedAtom);
  return (
    <Section title="ContextMenu preview">
      <VStack>
        <ContextMenu
          label="Sample record context"
          open={open}
          onOpenChange={setOpen}
          items={[
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
