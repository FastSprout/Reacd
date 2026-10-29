import { atom, useAtom } from 'jotai';
import { App, Toggle, VStack } from 'reacd';
import { ChatPromptExample } from '../../docs/examples/chat-prompt.js';
import { ChatPromptSubmitExample } from '../../docs/examples/chat-prompt-submit.js';
import { ChatPaletteExample } from '../../docs/examples/chat-palette.js';

const rtlAtom = atom(false);

export function ChatComposerExamples() {
  const [rtl, setRtl] = useAtom(rtlAtom);
  return (
    <VStack>
      <Toggle
        label="Right to left chat composer"
        checked={rtl}
        onCheckedChange={setRtl}
      />
      <App direction={rtl ? 'rtl' : 'ltr'}>
        <ChatPromptExample />
        <ChatPromptSubmitExample />
        <ChatPaletteExample />
      </App>
    </VStack>
  );
}
