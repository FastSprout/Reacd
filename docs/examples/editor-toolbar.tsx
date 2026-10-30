import { atom, useAtom } from 'jotai';
import { Button, Editor, EditorToolbar, Text, Toggle, VStack } from '@fastsprout/reacd';
import type { EditorDocument, EditorToolbarItem } from '@fastsprout/reacd';

const INITIAL_DOCUMENT: EditorDocument = {
  version: 1,
  blocks: [
    {
      type: 'paragraph',
      id: 'review-intro',
      content: [{ type: 'text', text: 'Toolbar draft.' }],
    },
  ],
};
const ITEMS: readonly EditorToolbarItem[] = [
  { command: 'bold' },
  { command: 'italic' },
  { command: 'heading2' },
  { command: 'link', href: 'https://reacd.dev/', label: 'Link to reacd' },
  { command: 'removeLink' },
  { command: 'undo' },
  { command: 'redo' },
];
const documentAtom = atom(INITIAL_DOCUMENT);
const disabledAtom = atom(false);
const readOnlyAtom = atom(false);

export function EditorToolbarExample() {
  const [value, setValue] = useAtom(documentAtom);
  const [disabled, setDisabled] = useAtom(disabledAtom);
  const [readOnly, setReadOnly] = useAtom(readOnlyAtom);
  return (
    <VStack>
      <Editor
        label="Review draft"
        value={value}
        onValueChange={setValue}
        readOnly={readOnly}
        toolbar={
          <EditorToolbar label="Review formatting" items={ITEMS} disabled={disabled} />
        }
      >
        <Text role="caption">Select text, then choose a formatting command.</Text>
      </Editor>
      <Toggle
        label="Disable review toolbar"
        checked={disabled}
        onCheckedChange={setDisabled}
      />
      <Toggle
        label="Read-only review draft"
        checked={readOnly}
        onCheckedChange={setReadOnly}
      />
      <Button
        label="Restore toolbar draft"
        intent="secondary"
        onPress={() => setValue(INITIAL_DOCUMENT)}
      />
    </VStack>
  );
}
