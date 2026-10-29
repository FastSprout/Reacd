import { atom, useAtom } from 'jotai';
import { App, Button, Editor, EditorEmojiMenu, Toggle, VStack } from 'reacd';
import type { EditorDocument } from 'reacd';

const INITIAL: EditorDocument = {
  version: 1,
  blocks: [{ type: 'paragraph', id: 'intro', content: [] }],
};
const documentAtom = atom(INITIAL);
const protectedAtom = atom(false);
const rtlAtom = atom(false);

export function EditorEmojiMenuExample() {
  const [value, setValue] = useAtom(documentAtom);
  const [readOnly, setReadOnly] = useAtom(protectedAtom);
  const [rtl, setRtl] = useAtom(rtlAtom);
  return (
    <VStack>
      <Toggle
        label="Right to left editor-emoji-menu"
        checked={rtl}
        onCheckedChange={setRtl}
      />
      <App direction={rtl ? 'rtl' : 'ltr'}>
        <Editor
          label="Emoji document"
          value={value}
          onValueChange={setValue}
          description="Type : to open the menu."
          readOnly={readOnly}
        >
          <EditorEmojiMenu
            label="Wave options"
            items={[
              { name: 'wave', label: 'Wave', value: '👋' },
              { name: 'check', label: 'Check', value: '✓' },
            ]}
          />
        </Editor>
        <Toggle
          label="Read-only editor-emoji-menu"
          checked={readOnly}
          onCheckedChange={setReadOnly}
        />
        <Button label="Reset editor-emoji-menu" onPress={() => setValue(INITIAL)} />
      </App>
    </VStack>
  );
}
