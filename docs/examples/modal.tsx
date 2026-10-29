import { atom, useAtom } from 'jotai';
import { Button, Input, Modal, Select, Text, Toggle, VStack } from 'reacd';

const openAtom = atom(false);
const nestedAtom = atom(false);
const lockedAtom = atom(false);
const nonModalAtom = atom(false);
const fullAtom = atom(false);
const longAtom = atom(false);
const noteAtom = atom('');
const roleAtom = atom('reader');

export function ModalExample() {
  const [open, setOpen] = useAtom(openAtom);
  const [nested, setNested] = useAtom(nestedAtom);
  const [locked, setLocked] = useAtom(lockedAtom);
  const [nonModal, setNonModal] = useAtom(nonModalAtom);
  const [fullscreen, setFullscreen] = useAtom(fullAtom);
  const [long, setLong] = useAtom(longAtom);
  const [note, setNote] = useAtom(noteAtom);
  const [role, setRole] = useAtom(roleAtom);
  return (
    <VStack>
      <Button label="Open programmatically" onPress={() => setOpen(true)} />
      <Toggle
        label="Require explicit close"
        checked={locked}
        onCheckedChange={setLocked}
      />
      <Toggle
        label="Non-modal example"
        checked={nonModal}
        onCheckedChange={setNonModal}
      />
      <Toggle
        label="Fullscreen example"
        checked={fullscreen}
        onCheckedChange={setFullscreen}
      />
      <Toggle label="Long dialog content" checked={long} onCheckedChange={setLong} />
      <Modal
        title="Edit modal example"
        description="Changes stay in this local preview."
        triggerLabel="Open modal example"
        open={open}
        onOpenChange={setOpen}
        retainContent
        dismissible={!locked}
        modal={!nonModal}
        fullscreen={fullscreen}
        footer={<Button label="Apply example" onPress={() => setOpen(false)} />}
      >
        <VStack>
          <Input label="Modal note" value={note} onValueChange={setNote} />
          <Select
            label="Modal role"
            value={role}
            onValueChange={setRole}
            items={[
              { value: 'reader', label: 'Reader' },
              { value: 'editor', label: 'Editor' },
            ]}
          />
          <Modal
            title="Nested modal"
            description="A second independent dialog."
            triggerLabel="Open nested modal"
            open={nested}
            onOpenChange={setNested}
          >
            <Text>Closing this dialog restores focus inside its parent.</Text>
          </Modal>
          <Text>
            {long
              ? 'Long dialog content without spaces: ' + 'retained_content_'.repeat(300)
              : 'Edit the note, then apply or close.'}
          </Text>
        </VStack>
      </Modal>
    </VStack>
  );
}
