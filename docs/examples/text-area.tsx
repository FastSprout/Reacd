import { atom, useAtom } from 'jotai';
import { Text, TextArea, VStack } from 'reacd';

const notesAtom = atom('Draft notes');

export function TextAreaExample() {
  const [notes, setNotes] = useAtom(notesAtom);
  return (
    <VStack>
      <TextArea label="Additional notes" value={notes} onValueChange={setNotes} />
      <Text>{`Current notes: ${notes}`}</Text>
    </VStack>
  );
}
