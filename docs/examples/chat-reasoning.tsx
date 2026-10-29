import { atom, useAtom } from 'jotai';
import { App, ChatReasoning, Input, Section, Toggle, VStack } from 'reacd';

const textAtom = atom('Example summary: validate the selected component contract.');
const openAtom = atom(false);
const streamingAtom = atom(false);
const automaticAtom = atom(false);
const disabledAtom = atom(false);
const rtlAtom = atom(false);

export function ChatReasoningExample() {
  const [text, setText] = useAtom(textAtom);
  const [open, setOpen] = useAtom(openAtom);
  const [streaming, setStreaming] = useAtom(streamingAtom);
  const [automatic, setAutomatic] = useAtom(automaticAtom);
  const [disabled, setDisabled] = useAtom(disabledAtom);
  const [rtl, setRtl] = useAtom(rtlAtom);
  return (
    <Section title="Chat reasoning preview">
      <VStack>
        <Input label="Example summary text" value={text} onValueChange={setText} />
        <Toggle
          label="Streaming summary"
          checked={streaming}
          onCheckedChange={setStreaming}
        />
        <Toggle
          label="Automatic summary disclosure"
          checked={automatic}
          onCheckedChange={setAutomatic}
        />
        <Toggle
          label="Protect summary disclosure"
          checked={disabled}
          onCheckedChange={setDisabled}
        />
        <Toggle label="Right to left summary" checked={rtl} onCheckedChange={setRtl} />
        <App direction={rtl ? 'rtl' : 'ltr'}>
          <ChatReasoning
            text={text}
            open={open}
            onOpenChange={setOpen}
            streaming={streaming}
            autoOpen={automatic}
            autoClose={automatic}
            disabled={disabled}
          />
        </App>
      </VStack>
    </Section>
  );
}
