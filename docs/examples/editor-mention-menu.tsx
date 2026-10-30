import { atom, useAtom } from 'jotai';
import {
  App,
  Button,
  Editor,
  EditorMentionMenu,
  Toggle,
  VStack,
} from '@fastsprout/reacd';
import type { EditorDocument } from '@fastsprout/reacd';

const INITIAL: EditorDocument = {
  version: 1,
  blocks: [{ type: 'paragraph', id: 'intro', content: [] }],
};
const documentAtom = atom(INITIAL);
const protectedAtom = atom(false);
const rtlAtom = atom(false);

export function EditorMentionMenuExample() {
  const [value, setValue] = useAtom(documentAtom);
  const [readOnly, setReadOnly] = useAtom(protectedAtom);
  const [rtl, setRtl] = useAtom(rtlAtom);
  return (
    <VStack>
      <Toggle
        label="Right to left editor-mention-menu"
        checked={rtl}
        onCheckedChange={setRtl}
      />
      <App direction={rtl ? 'rtl' : 'ltr'}>
        <Editor
          label="Mention document"
          value={value}
          onValueChange={setValue}
          description="Type @ to open the menu."
          readOnly={readOnly}
        >
          <EditorMentionMenu
            label="Example person options"
            items={[
              { id: 'person', label: 'Example person' },
              { id: 'other', label: 'Another example', disabled: true },
            ]}
          />
        </Editor>
        <Toggle
          label="Read-only editor-mention-menu"
          checked={readOnly}
          onCheckedChange={setReadOnly}
        />
        <Button label="Reset editor-mention-menu" onPress={() => setValue(INITIAL)} />
      </App>
    </VStack>
  );
}
