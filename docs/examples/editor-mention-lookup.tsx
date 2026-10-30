import { atom, useAtom } from 'jotai';
import {
  App,
  Button,
  Editor,
  EditorMentionMenu,
  HStack,
  Text,
  Toggle,
  VStack,
} from '@fastsprout/reacd';
import type {
  EditorDocument,
  EditorMentionLookupRequest,
  EditorMentionLookupResult,
} from '@fastsprout/reacd';

const INITIAL: EditorDocument = {
  version: 1,
  blocks: [{ type: 'paragraph', id: 'directory-note', content: [] }],
};
const documentAtom = atom(INITIAL);
const requestAtom = atom<EditorMentionLookupRequest | null>(null);
const responseAtom = atom<EditorMentionLookupResult | null>(null);
const savedAtom = atom<EditorMentionLookupResult | null>(null);
const countAtom = atom(0);
const readOnlyAtom = atom(false);
const disabledAtom = atom(false);
const rejectAtom = atom(false);
const rtlAtom = atom(false);

export function EditorMentionLookupExample() {
  const [value, setValue] = useAtom(documentAtom);
  const [request, setRequest] = useAtom(requestAtom);
  const [response, setResponse] = useAtom(responseAtom);
  const [saved, setSaved] = useAtom(savedAtom);
  const [count, setCount] = useAtom(countAtom);
  const [readOnly, setReadOnly] = useAtom(readOnlyAtom);
  const [disabled, setDisabled] = useAtom(disabledAtom);
  const [reject, setReject] = useAtom(rejectAtom);
  const [rtl, setRtl] = useAtom(rtlAtom);
  const ready = response?.status === 'ready' ? response : null;
  return (
    <VStack>
      <Text role="headline">Local response simulator</Text>
      <Text>
        Type @qq, then resolve or fail the current request. No network is used.
      </Text>
      <Toggle label="Right to left lookup" checked={rtl} onCheckedChange={setRtl} />
      <App direction={rtl ? 'rtl' : 'ltr'}>
        <VStack>
          <Editor
            label="Directory lookup document"
            value={value}
            onValueChange={(next) => {
              if (!reject) setValue(next);
            }}
            readOnly={readOnly}
            disabled={disabled}
          >
            <EditorMentionMenu
              label="Remote directory options"
              results={response}
              onQueryChange={(next) => {
                setRequest(next);
                setCount((current) => current + 1);
                setResponse({ ...next, status: 'loading' });
              }}
            />
          </Editor>
          <Text>{`Lookup requests: ${count}`}</Text>
          <Text>{`Lookup key: ${request?.key ?? 'none'}`}</Text>
          <Text>{`Lookup query: ${request?.query ?? 'none'}`}</Text>
          <Text>{`Delivered response: ${response?.status ?? 'none'}`}</Text>
          {request !== null && (
            <HStack>
              <Button
                label="Resolve current"
                onPress={() =>
                  setResponse({
                    ...request,
                    status: 'ready',
                    items: [
                      {
                        id: 'directory-person',
                        label: `Directory entry ${request.key}`,
                      },
                    ],
                  })
                }
              />
              <Button
                label="Fail current"
                onPress={() =>
                  setResponse({
                    ...request,
                    status: 'error',
                    error: 'Simulated lookup error.',
                  })
                }
              />
              <Button
                label="Empty current"
                onPress={() => setResponse({ ...request, status: 'ready', items: [] })}
              />
              <Button label="Clear response" onPress={() => setResponse(null)} />
            </HStack>
          )}
          <HStack>
            {ready !== null && (
              <Button
                label="Save response for replay"
                onPress={() => setSaved(ready)}
              />
            )}
            {saved !== null && (
              <Button
                label="Replay saved response"
                onPress={() => setResponse(saved)}
              />
            )}
          </HStack>
          <Toggle
            label="Read-only lookup document"
            checked={readOnly}
            onCheckedChange={setReadOnly}
          />
          <Toggle
            label="Disable lookup document"
            checked={disabled}
            onCheckedChange={setDisabled}
          />
          <Toggle
            label="Reject lookup edits"
            checked={reject}
            onCheckedChange={setReject}
          />
          <Button
            label="Reset lookup document"
            onPress={() => {
              setValue(INITIAL);
              setRequest(null);
              setResponse(null);
              setSaved(null);
              setCount(0);
              setReadOnly(false);
              setDisabled(false);
              setReject(false);
              setRtl(false);
            }}
          />
        </VStack>
      </App>
    </VStack>
  );
}
