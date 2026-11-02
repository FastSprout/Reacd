import { atom, useAtom } from 'jotai';
import {
  Button,
  ChatAttachment,
  Input,
  Section,
  Text,
  Toggle,
  VStack,
} from '@fastsprout/reacd';

const shownAtom = atom(true);
const uploadingAtom = atom(false);
const failedAtom = atom(false);
const protectedAtom = atom(false);
const imageAtom = atom(false);
const urlAtom = atom('');

export function ChatAttachmentExample() {
  const [shown, setShown] = useAtom(shownAtom);
  const [uploading, setUploading] = useAtom(uploadingAtom);
  const [failed, setFailed] = useAtom(failedAtom);
  const [protectedFile, setProtectedFile] = useAtom(protectedAtom);
  const [image, setImage] = useAtom(imageAtom);
  const [url, setUrl] = useAtom(urlAtom);
  return (
    <Section title="Chat attachment preview">
      <VStack>
        <Toggle
          label="Uploading attachment"
          checked={uploading}
          onCheckedChange={setUploading}
        />
        <Toggle
          label="Failed attachment"
          checked={failed}
          onCheckedChange={setFailed}
        />
        <Toggle
          label="Protect attachment"
          checked={protectedFile}
          onCheckedChange={setProtectedFile}
        />
        <Toggle
          label="Preview image attachment"
          checked={image}
          onCheckedChange={setImage}
        />
        <Input label="Attachment image URL" value={url} onValueChange={setUrl} />
        {shown ? (
          <ChatAttachment
            name={image ? 'example-reference.png' : 'example-reference.txt'}
            mediaType={image ? 'image/png' : 'text/plain'}
            url={url === '' ? undefined : url}
            description="Example attachment metadata. No file is uploaded."
            status={failed ? 'error' : uploading ? 'uploading' : 'idle'}
            disabled={protectedFile}
            onRemove={() => setShown(false)}
          />
        ) : (
          <Text>Example attachment removed.</Text>
        )}
        <Button label="Restore attachment" onPress={() => setShown(true)} />
      </VStack>
    </Section>
  );
}
