import { atom, useAtom } from 'jotai';
import {
  App,
  Button,
  FileUpload,
  Form,
  SubmitButton,
  Text,
  Toggle,
  VStack,
  readUploadBytes,
} from '@fastsprout/reacd';
import type { UploadFile } from '@fastsprout/reacd';
const SAMPLE: UploadFile = {
  id: 'sample',
  name: 'Saved-document-with-a-long-readable-file-name.txt',
  mediaType: 'text/plain',
  size: 5,
  lastModified: 0,
  content: { encoding: 'base64', data: 'SGVsbG8=' },
};
const filesAtom = atom<readonly UploadFile[]>([]);
const readonlyAtom = atom(false);
const disabledAtom = atom(false);
const rejectAtom = atom(false);
const rtlAtom = atom(false);
const statusAtom = atom('Files are not saved.');
export function FileUploadExample() {
  const [files, setFiles] = useAtom(filesAtom);
  const [readOnly, setReadOnly] = useAtom(readonlyAtom);
  const [disabled, setDisabled] = useAtom(disabledAtom);
  const [reject, setReject] = useAtom(rejectAtom);
  const [rtl, setRtl] = useAtom(rtlAtom);
  const [status, setStatus] = useAtom(statusAtom);
  return (
    <VStack>
      <Toggle label="Right to left files" checked={rtl} onCheckedChange={setRtl} />
      <App direction={rtl ? 'rtl' : 'ltr'}>
        <VStack>
          <Form label="Files form" onSubmit={() => setStatus('Files saved.')}>
            <FileUpload
              label="Attachments"
              value={files}
              onValueChange={(next) => {
                if (!reject) setFiles(next);
              }}
              name="attachments"
              required
              readOnly={readOnly}
              disabled={disabled}
              description="Read local content. The host owns network upload."
            />
            <SubmitButton label="Save files" />
          </Form>
          <Toggle
            label="Read-only files"
            checked={readOnly}
            onCheckedChange={setReadOnly}
          />
          <Toggle
            label="Disable files"
            checked={disabled}
            onCheckedChange={setDisabled}
          />
          <Toggle
            label="Reject file changes"
            checked={reject}
            onCheckedChange={setReject}
          />
          <Button label="Restore sample file" onPress={() => setFiles([SAMPLE])} />
          <Button label="Clear files" onPress={() => setFiles([])} />
          <Text>
            {files
              .map((file) => `${file.name}: ${readUploadBytes(file).length} bytes`)
              .join('; ') || 'No content yet.'}
          </Text>
          <Text>{status}</Text>
        </VStack>
      </App>
    </VStack>
  );
}
