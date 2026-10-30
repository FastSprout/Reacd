import { atom, useAtom } from 'jotai';
import {
  AuthForm,
  Button,
  Editor,
  EditorDragHandle,
  EditorSuggestionMenu,
  EditorToolbar,
  FormField,
  Text,
  Toggle,
  VStack,
} from '@fastsprout/reacd';
import type { EditorDocument, EditorSelection } from '@fastsprout/reacd';

const INITIAL: EditorDocument = {
  version: 1,
  blocks: [
    { type: 'paragraph', id: 'field', content: [{ type: 'text', text: 'Field note' }] },
  ],
};
const HOST: EditorDocument = {
  version: 1,
  blocks: [
    { type: 'paragraph', id: 'field', content: [{ type: 'text', text: 'Host note' }] },
  ],
};
const INITIAL_SELECTION: EditorSelection = {
  anchor: { blockId: 'field', offset: 0 },
  focus: { blockId: 'field', offset: 0 },
};
const fieldAtom = atom(INITIAL);
const selectionAtom = atom(INITIAL_SELECTION);
const authAtom = atom(INITIAL);
const independentAtom = atom(INITIAL);
const disabledAtom = atom(true);
const readOnlyAtom = atom(false);
const errorAtom = atom(true);
const loadingAtom = atom(false);
const authDisabledAtom = atom(false);
const fieldRequestsAtom = atom(0);
const authRequestsAtom = atom(0);
const submissionsAtom = atom(0);

export function EditorFieldView({ onTemplate }: { onTemplate: () => void }) {
  const [field, setField] = useAtom(fieldAtom);
  const [selection, setSelection] = useAtom(selectionAtom);
  const [auth, setAuth] = useAtom(authAtom);
  const [independent, setIndependent] = useAtom(independentAtom);
  const [disabled, setDisabled] = useAtom(disabledAtom);
  const [readOnly, setReadOnly] = useAtom(readOnlyAtom);
  const [error, setError] = useAtom(errorAtom);
  const [loading, setLoading] = useAtom(loadingAtom);
  const [authDisabled, setAuthDisabled] = useAtom(authDisabledAtom);
  const [fieldRequests, setFieldRequests] = useAtom(fieldRequestsAtom);
  const [authRequests, setAuthRequests] = useAtom(authRequestsAtom);
  const [submissions, setSubmissions] = useAtom(submissionsAtom);
  return (
    <VStack>
      <Button label="Switch template" onPress={onTemplate} />
      <Toggle
        label="Disable editor field"
        checked={disabled}
        onCheckedChange={setDisabled}
      />
      <Toggle
        label="Readonly editor field"
        checked={readOnly}
        onCheckedChange={setReadOnly}
      />
      <Toggle label="Editor field error" checked={error} onCheckedChange={setError} />
      <Button
        label="Replace field from host"
        onPress={() => {
          setField(HOST);
          setSelection(INITIAL_SELECTION);
        }}
      />
      <FormField
        name="field-note"
        label="Field metadata"
        disabled={disabled}
        description="Group guidance"
        error={error ? 'Server rejected' : ''}
      >
        <Editor
          label="Field note"
          description="Editor guidance"
          value={field}
          disabled={false}
          readOnly={readOnly}
          selection={selection}
          onEditChange={(edit) => {
            setField(edit.value);
            setSelection(edit.selection);
            setFieldRequests((count) => count + 1);
          }}
          toolbar={
            <EditorToolbar
              label="Field tools"
              items={[{ command: 'bold', label: 'Field bold' }]}
            />
          }
        >
          <EditorDragHandle label="Field blocks" blockId="field" />
          <EditorSuggestionMenu
            label="Field commands"
            items={[{ command: 'heading1', label: 'Field heading' }]}
          />
        </Editor>
      </FormField>
      <Text>{`Field requests: ${fieldRequests}`}</Text>
      <Toggle label="Auth loading" checked={loading} onCheckedChange={setLoading} />
      <Toggle
        label="Auth disabled"
        checked={authDisabled}
        onCheckedChange={setAuthDisabled}
      />
      <AuthForm
        label="Auth proof"
        submitLabel="Submit auth proof"
        loading={loading}
        disabled={authDisabled}
        onSubmit={() => setSubmissions((count) => count + 1)}
      >
        <Editor
          label="Auth note"
          value={auth}
          disabled={false}
          onValueChange={(next) => {
            setAuth(next);
            setAuthRequests((count) => count + 1);
          }}
        />
      </AuthForm>
      <Text>{`Auth requests: ${authRequests}`}</Text>
      <Text>{`Auth submissions: ${submissions}`}</Text>
      <Editor
        label="Independent note"
        value={independent}
        onValueChange={setIndependent}
      />
    </VStack>
  );
}
