import { atom, useAtom } from 'jotai';
import { Button, Editor, EditorToolbar, Text, Toggle, VStack } from '@fastsprout/reacd';
import type { EditorEdit } from '@fastsprout/reacd';

const INITIAL_TEXT = 'Controlled draft.';
const BLOCK_ID = 'controlled-intro';
const INITIAL_EDIT: EditorEdit = {
  value: {
    version: 1,
    blocks: [
      {
        type: 'paragraph',
        id: BLOCK_ID,
        content: [{ type: 'text', text: INITIAL_TEXT }],
      },
    ],
  },
  selection: {
    anchor: { blockId: BLOCK_ID, offset: INITIAL_TEXT.length },
    focus: { blockId: BLOCK_ID, offset: INITIAL_TEXT.length },
  },
};
const editAtom = atom<EditorEdit>(INITIAL_EDIT);
const rejectAtom = atom(false);
const requestsAtom = atom(0);

export function EditorControlledExample() {
  const [edit, setEdit] = useAtom(editAtom);
  const [reject, setReject] = useAtom(rejectAtom);
  const [requests, setRequests] = useAtom(requestsAtom);
  return (
    <VStack>
      <Editor
        label="Controlled notes"
        description="Document and selection are accepted as one edit."
        value={edit.value}
        selection={edit.selection}
        onEditChange={(next) => {
          setRequests((count) => count + 1);
          if (!reject) setEdit(next);
        }}
        toolbar={
          <EditorToolbar
            label="Controlled formatting"
            items={[{ command: 'undo' }, { command: 'redo' }]}
          />
        }
      >
        <Text role="caption">Press Enter to split, then Backspace to merge.</Text>
      </Editor>
      <Toggle
        label="Reject atomic edits"
        checked={reject}
        onCheckedChange={setReject}
      />
      <Button
        label="Restore atomic draft"
        intent="secondary"
        onPress={() => {
          setEdit(INITIAL_EDIT);
          setRequests(0);
        }}
      />
      <Text>{`Accepted blocks: ${edit.value.blocks.length}`}</Text>
      <Text>{`Atomic edit requests: ${requests}`}</Text>
    </VStack>
  );
}
