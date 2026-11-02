import { atom, useAtom } from 'jotai';
import { App, Toggle, VStack } from '@fastsprout/reacd';
import { ChatReasoningExample } from '../fixtures/chat-reasoning.js';
import { ChatToolExample } from '../fixtures/chat-tool.js';
import { ChatShimmerExample } from '../fixtures/chat-shimmer.js';

const rtlAtom = atom(false);

export function ChatFeedbackExamples() {
  const [rtl, setRtl] = useAtom(rtlAtom);
  return (
    <VStack>
      <Toggle
        label="Right to left chat feedback"
        checked={rtl}
        onCheckedChange={setRtl}
      />
      <App direction={rtl ? 'rtl' : 'ltr'}>
        <ChatReasoningExample />
        <ChatToolExample />
        <ChatShimmerExample />
      </App>
    </VStack>
  );
}
