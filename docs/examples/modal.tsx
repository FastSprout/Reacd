import { atom, useAtom } from 'jotai';
import { Button, Input, Modal, Text, VStack } from '@fastsprout/reacd';

const openAtom = atom(false);
const nameAtom = atom('Ada Lovelace');
const savedNameAtom = atom('Ada Lovelace');

export function ModalExample() {
  const [open, setOpen] = useAtom(openAtom);
  const [name, setName] = useAtom(nameAtom);
  const [savedName, setSavedName] = useAtom(savedNameAtom);

  function saveProfile() {
    setSavedName(name);
    setOpen(false);
  }

  return (
    <VStack>
      <Modal
        title="Edit profile"
        description="Update your display name."
        triggerLabel="Edit profile"
        open={open}
        onOpenChange={setOpen}
        footer={<Button label="Save profile" onPress={saveProfile} />}
      >
        <Input label="Display name" value={name} onValueChange={setName} />
      </Modal>
      <Text>{`Saved name: ${savedName}`}</Text>
    </VStack>
  );
}
