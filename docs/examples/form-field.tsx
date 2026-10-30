import { atom, useAtom } from 'jotai';
import {
  App,
  Button,
  Form,
  FormField,
  SubmitButton,
  Switch,
  Text,
  Textarea,
  Toggle,
  VStack,
} from '@fastsprout/reacd';

const approvedAtom = atom(false);
const notesAtom = atom('');
const errorAtom = atom('');
const disabledAtom = atom(false);
const rtlAtom = atom(false);
const statusAtom = atom('Account is not saved.');
const HOST_ERROR = 'Account notes need a review by the owner.';

export function FormFieldExample() {
  const [approved, setApproved] = useAtom(approvedAtom);
  const [notes, setNotes] = useAtom(notesAtom);
  const [error, setError] = useAtom(errorAtom);
  const [disabled, setDisabled] = useAtom(disabledAtom);
  const [rtl, setRtl] = useAtom(rtlAtom);
  const [status, setStatus] = useAtom(statusAtom);
  return (
    <VStack>
      <Toggle label="Right to left fields" checked={rtl} onCheckedChange={setRtl} />
      <App direction={rtl ? 'rtl' : 'ltr'}>
        <VStack>
          <Form
            label="Account fields form"
            onSubmit={() => setStatus('Account saved.')}
          >
            <FormField name="approved" label="Approval" required disabled={disabled}>
              <Switch
                label="Approve account"
                checked={approved}
                onCheckedChange={setApproved}
              />
            </FormField>
            <FormField
              name="notes"
              label="Review details"
              required
              disabled={disabled}
              description="Only the account owner can resolve a review error."
              help="Record why this account can be approved."
              hint="Internal review"
              error={error}
            >
              <Textarea
                label="Account notes"
                value={notes}
                onValueChange={setNotes}
                autoResize
                rows={2}
                maxRows={6}
                minLength={4}
                maxLength={1000}
              />
            </FormField>
            <SubmitButton label="Save account fields" />
          </Form>
          <Button label="Reject account notes" onPress={() => setError(HOST_ERROR)} />
          <Button label="Clear account error" onPress={() => setError('')} />
          <Toggle
            label="Disable account fields"
            checked={disabled}
            onCheckedChange={setDisabled}
          />
          <Text>{status}</Text>
        </VStack>
      </App>
    </VStack>
  );
}
