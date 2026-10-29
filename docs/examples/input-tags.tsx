import { atom, useAtom } from 'jotai';
import {
  App,
  Button,
  Form,
  InputTags,
  SubmitButton,
  Text,
  Toggle,
  VStack,
} from 'reacd';

const tagsAtom = atom<readonly string[]>(['React']);
const readOnlyAtom = atom(false);
const rtlAtom = atom(false);
const statusAtom = atom('Topics are not saved.');
const TAG_LIMIT = 4;
const TAG_LENGTH = 24;

export function InputTagsExample() {
  const [tags, setTags] = useAtom(tagsAtom);
  const [readOnly, setReadOnly] = useAtom(readOnlyAtom);
  const [rtl, setRtl] = useAtom(rtlAtom);
  const [status, setStatus] = useAtom(statusAtom);
  return (
    <VStack>
      <Toggle label="Right to left tags" checked={rtl} onCheckedChange={setRtl} />
      <App direction={rtl ? 'rtl' : 'ltr'}>
        <VStack>
          <Form label="Topics form" onSubmit={() => setStatus('Topics saved.')}>
            <InputTags
              label="Topics"
              value={tags}
              onValueChange={setTags}
              description="Use Enter or paste comma-separated topics."
              placeholder="Enter a topic"
              maxTags={TAG_LIMIT}
              maxTagLength={TAG_LENGTH}
              delimiters={['comma', 'newline']}
              addOnPaste
              addOnTab
              readOnly={readOnly}
              required
              name="topics"
            />
            <SubmitButton label="Save topics" />
          </Form>
          <Toggle
            label="Read-only topics"
            checked={readOnly}
            onCheckedChange={setReadOnly}
          />
          <Button
            label="Clear topics"
            onPress={() => setTags([])}
            disabled={readOnly}
            intent="secondary"
          />
          <Text>{`Topics: ${tags.join(', ')}`}</Text>
          <Text>{status}</Text>
        </VStack>
      </App>
    </VStack>
  );
}
