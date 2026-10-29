import { atom, useAtom } from 'jotai';
import { Button, Text, Textarea, Toggle, VStack } from 'reacd';

const notesAtom = atom('');
const autoResizeAtom = atom(true);
const readOnlyAtom = atom(false);
const LONG_NOTES = Array.from(
  { length: 10 },
  (_, index) => `Line ${index + 1}: Release details remain reachable at the row cap.`,
).join('\n');

export function TextareaExample() {
  const [notes, setNotes] = useAtom(notesAtom);
  const [autoResize, setAutoResize] = useAtom(autoResizeAtom);
  const [readOnly, setReadOnly] = useAtom(readOnlyAtom);
  return (
    <VStack>
      <Textarea
        label="Release notes"
        description="Describe the customer-visible changes."
        value={notes}
        onValueChange={setNotes}
        autoResize={autoResize}
        rows={2}
        maxRows={6}
        maxLength={1000}
        readOnly={readOnly}
      />
      <Toggle
        label="Automatic notes height"
        checked={autoResize}
        onCheckedChange={setAutoResize}
      />
      <Toggle
        label="Read-only notes"
        checked={readOnly}
        onCheckedChange={setReadOnly}
      />
      <Button label="Fill long release notes" onPress={() => setNotes(LONG_NOTES)} />
      <Button label="Clear release notes" onPress={() => setNotes('')} />
      <Text>{`${notes.length} characters`}</Text>
    </VStack>
  );
}
