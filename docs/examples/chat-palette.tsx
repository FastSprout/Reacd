import { atom, useAtom } from 'jotai';
import { ChatPalette, ChatPrompt, ChatMessages } from '@fastsprout/reacd';
import type { ChatMessagesProps } from '@fastsprout/reacd';

const draftAtom = atom('');
const messagesAtom = atom<ChatMessagesProps['messages']>([]);

export function ChatPaletteExample() {
  const [draft, setDraft] = useAtom(draftAtom);
  const [messages, setMessages] = useAtom(messagesAtom);
  return (
    <ChatPalette
      label="Local conversation"
      prompt={
        <ChatPrompt
          label="Message"
          value={draft}
          onValueChange={setDraft}
          onSubmit={(content) => {
            setMessages([
              ...messages,
              {
                id: `message-${messages.length + 1}`,
                author: 'You',
                role: 'user',
                content,
              },
            ]);
            setDraft('');
          }}
        />
      }
    >
      <ChatMessages label="Conversation history" messages={messages} />
    </ChatPalette>
  );
}
