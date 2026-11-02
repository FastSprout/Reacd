import { atom, useAtom } from 'jotai';
import {
  ChatPalette,
  ChatPrompt,
  ChatMessages,
  Modal,
  Section,
} from '@fastsprout/reacd';

const openAtom = atom(false);
const draftAtom = atom('');
const sentAtom = atom('Example conversation content.');

export function ChatPaletteExample() {
  const [open, setOpen] = useAtom(openAtom);
  const [draft, setDraft] = useAtom(draftAtom);
  const [sent, setSent] = useAtom(sentAtom);
  return (
    <Section title="Chat palette preview">
      <Modal
        title="Example conversation"
        description="A local composer demonstration."
        triggerLabel="Open example conversation"
        open={open}
        onOpenChange={setOpen}
      >
        <ChatPalette
          label="Palette conversation"
          prompt={
            <ChatPrompt
              label="Palette message"
              value={draft}
              onValueChange={setDraft}
              onSubmit={setSent}
              onClose={() => setOpen(false)}
            />
          }
        >
          <ChatMessages
            label="Palette transcript"
            messages={[
              { id: 'example', author: 'Example user', role: 'user', content: sent },
            ]}
          />
        </ChatPalette>
      </Modal>
    </Section>
  );
}
