import { atom, useAtom } from 'jotai';
import {
  App,
  Button,
  Editor,
  EditorToolbar,
  Text,
  Toggle,
  VStack,
} from '@fastsprout/reacd';
import type { EditorDocument } from '@fastsprout/reacd';

const INITIAL_DOCUMENT: EditorDocument = {
  version: 1,
  blocks: [
    {
      type: 'paragraph',
      id: 'project-intro',
      content: [{ type: 'text', text: 'Start a project note.' }],
    },
  ],
};
const HOST_DOCUMENT: EditorDocument = {
  version: 1,
  blocks: [
    {
      type: 'paragraph',
      id: 'host-note',
      content: [{ type: 'text', text: 'Replaced by the host.' }],
    },
  ],
};
const documentAtom = atom(INITIAL_DOCUMENT);
const readOnlyAtom = atom(false);
const disabledAtom = atom(false);
const rejectAtom = atom(false);
const rtlAtom = atom(false);
const requestsAtom = atom(0);

export function EditorExample() {
  const [value, setValue] = useAtom(documentAtom);
  const [readOnly, setReadOnly] = useAtom(readOnlyAtom);
  const [disabled, setDisabled] = useAtom(disabledAtom);
  const [reject, setReject] = useAtom(rejectAtom);
  const [rtl, setRtl] = useAtom(rtlAtom);
  const [requests, setRequests] = useAtom(requestsAtom);
  return (
    <VStack>
      <Toggle label="Right to left notes" checked={rtl} onCheckedChange={setRtl} />
      <App direction={rtl ? 'rtl' : 'ltr'}>
        <VStack>
          <Editor
            label="Project notes"
            description="Edit the note and compare the accepted read-only copy."
            placeholder="Write a project note"
            value={value}
            readOnly={readOnly}
            disabled={disabled}
            onValueChange={(next) => {
              setRequests((count) => count + 1);
              if (!reject) setValue(next);
            }}
            toolbar={<EditorToolbar label="Document formatting" />}
          >
            <Text role="caption">The reader follows accepted updates.</Text>
          </Editor>
          <Editor
            label="Notes reader"
            value={value}
            onValueChange={setValue}
            readOnly
          />
          <Toggle
            label="Read-only notes"
            checked={readOnly}
            onCheckedChange={setReadOnly}
          />
          <Toggle
            label="Disable notes"
            checked={disabled}
            onCheckedChange={setDisabled}
          />
          <Toggle
            label="Reject note changes"
            checked={reject}
            onCheckedChange={setReject}
          />
          <Button
            label="Replace notes from host"
            intent="secondary"
            onPress={() => setValue(HOST_DOCUMENT)}
          />
          <Button
            label="Restore notes document"
            intent="secondary"
            onPress={() => {
              setValue(INITIAL_DOCUMENT);
              setRequests(0);
            }}
          />
          <Text>{`Document edit requests: ${requests}`}</Text>
        </VStack>
      </App>
    </VStack>
  );
}
