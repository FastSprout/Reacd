import { atom, useAtom } from 'jotai';
import { App, Button, Editor, EditorSuggestionMenu, Toggle, VStack } from 'reacd';
import type { EditorDocument } from 'reacd';

const INITIAL: EditorDocument = {
  version: 1,
  blocks: [{ type: 'paragraph', id: 'intro', content: [] }],
};
const documentAtom = atom(INITIAL);
const protectedAtom = atom(false);
const rtlAtom = atom(false);

export function EditorSuggestionMenuExample() {
  const [value, setValue] = useAtom(documentAtom);
  const [readOnly, setReadOnly] = useAtom(protectedAtom);
  const [rtl, setRtl] = useAtom(rtlAtom);
  return (
    <VStack>
      <Toggle
        label="Right to left editor-suggestion-menu"
        checked={rtl}
        onCheckedChange={setRtl}
      />
      <App direction={rtl ? 'rtl' : 'ltr'}>
        <Editor
          label="Block suggestion document"
          value={value}
          onValueChange={setValue}
          description="Type / to open the menu."
          readOnly={readOnly}
        >
          <EditorSuggestionMenu
            label="Heading options"
            items={[
              { command: 'paragraph', label: 'Paragraph' },
              { command: 'heading1', label: 'Heading' },
            ]}
          />
        </Editor>
        <Toggle
          label="Read-only editor-suggestion-menu"
          checked={readOnly}
          onCheckedChange={setReadOnly}
        />
        <Button
          label="Reset editor-suggestion-menu"
          onPress={() => setValue(INITIAL)}
        />
      </App>
    </VStack>
  );
}
