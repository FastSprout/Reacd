import { atom, useAtom } from 'jotai';
import { Button, Input, Popover, Text, VStack } from '@fastsprout/reacd';

const openAtom = atom(false);
const noteAtom = atom('');
const savedNoteAtom = atom('No delivery note.');

export function PopoverExample() {
  const [open, setOpen] = useAtom(openAtom);
  const [note, setNote] = useAtom(noteAtom);
  const [savedNote, setSavedNote] = useAtom(savedNoteAtom);

  function saveNote() {
    setSavedNote(note);
    setOpen(false);
  }

  return (
    <VStack>
      <Popover
        title="Delivery instructions"
        triggerLabel="Add delivery note"
        open={open}
        onOpenChange={setOpen}
        footer={<Button label="Save note" onPress={saveNote} />}
      >
        <Input label="Delivery note" value={note} onValueChange={setNote} />
      </Popover>
      <Text>{`Saved note: ${savedNote}`}</Text>
    </VStack>
  );
}
