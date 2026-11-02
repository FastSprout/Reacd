import { atom, useAtom } from 'jotai';
import { ChatAttachment, Text } from '@fastsprout/reacd';

const shownAtom = atom(true);

export function ChatAttachmentExample() {
  const [shown, setShown] = useAtom(shownAtom);
  return shown ? (
    <ChatAttachment
      name="example-reference.txt"
      mediaType="text/plain"
      description="Sample project notes"
      onRemove={() => setShown(false)}
    />
  ) : (
    <Text>Example attachment removed.</Text>
  );
}
