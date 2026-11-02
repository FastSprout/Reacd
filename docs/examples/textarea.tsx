import { atom, useAtom } from 'jotai';
import { Textarea } from '@fastsprout/reacd';

const notesAtom = atom('');

export function TextareaExample() {
  const [notes, setNotes] = useAtom(notesAtom);

  return (
    <Textarea
      label="Release notes"
      description="Describe the customer-visible changes."
      value={notes}
      onValueChange={setNotes}
      autoResize
      rows={2}
      maxRows={6}
    />
  );
}
