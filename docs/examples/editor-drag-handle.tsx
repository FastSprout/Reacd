import { atom, useAtom } from 'jotai';
import { App, Button, Editor, EditorDragHandle, Text, Toggle, VStack } from 'reacd';
import type { EditorDocument, EditorSelection, EditorEdit } from 'reacd';
const INITIAL: EditorDocument = {
  version: 1,
  blocks: [
    { type: 'paragraph', id: 'prepare', content: [{ type: 'text', text: 'Prepare' }] },
    { type: 'paragraph', id: 'review', content: [{ type: 'text', text: 'Review' }] },
    { type: 'paragraph', id: 'publish', content: [{ type: 'text', text: 'Publish' }] },
  ],
};
const SELECTION: EditorSelection = {
  anchor: { blockId: 'review', offset: 0 },
  focus: { blockId: 'review', offset: 0 },
};
const INITIAL_EDIT: EditorEdit = { value: INITIAL, selection: SELECTION };
const editAtom = atom(INITIAL_EDIT);
const readonlyAtom = atom(false);
const disabledAtom = atom(false);
const rejectAtom = atom(false);
const rtlAtom = atom(false);
export function EditorDragHandleExample() {
  const [edit, setEdit] = useAtom(editAtom);
  const [readOnly, setReadOnly] = useAtom(readonlyAtom);
  const [disabled, setDisabled] = useAtom(disabledAtom);
  const [reject, setReject] = useAtom(rejectAtom);
  const [rtl, setRtl] = useAtom(rtlAtom);
  const order = edit.value.blocks.map((block) => block.id).join(', ');
  return (
    <VStack>
      <Toggle
        label="Right to left block controls"
        checked={rtl}
        onCheckedChange={setRtl}
      />
      <App direction={rtl ? 'rtl' : 'ltr'}>
        <VStack>
          <Editor
            label="Block reorder document"
            value={edit.value}
            onEditChange={(next) => {
              if (!reject) setEdit(next);
            }}
            selection={edit.selection}
            readOnly={readOnly}
            disabled={disabled}
            toolbar={<EditorDragHandle label="Review block" blockId="review" />}
          />
          <Text>{`Block order: ${order}`}</Text>
          <Toggle
            label="Read-only block document"
            checked={readOnly}
            onCheckedChange={setReadOnly}
          />
          <Toggle
            label="Disable block document"
            checked={disabled}
            onCheckedChange={setDisabled}
          />
          <Toggle
            label="Reject block moves"
            checked={reject}
            onCheckedChange={setReject}
          />
          <Button
            label="Restore block order"
            onPress={() => {
              setEdit(INITIAL_EDIT);
            }}
          />
        </VStack>
      </App>
    </VStack>
  );
}
