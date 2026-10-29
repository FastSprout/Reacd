import { atom, useAtom } from 'jotai';
import {
  App,
  Button,
  Checkbox,
  Form,
  FormField,
  SubmitButton,
  Text,
  Toggle,
  VStack,
} from 'reacd';

const checkedAtom = atom(false);
const mixedAtom = atom(true);
const readOnlyAtom = atom(false);
const disabledAtom = atom(false);
const rtlAtom = atom(false);
const statusAtom = atom('Approval is not saved.');

export function CheckboxExample() {
  const [checked, setChecked] = useAtom(checkedAtom);
  const [mixed, setMixed] = useAtom(mixedAtom);
  const [readOnly, setReadOnly] = useAtom(readOnlyAtom);
  const [disabled, setDisabled] = useAtom(disabledAtom);
  const [rtl, setRtl] = useAtom(rtlAtom);
  const [status, setStatus] = useAtom(statusAtom);
  const approvalState = mixed ? 'mixed' : checked ? 'approved' : 'unapproved';
  return (
    <VStack>
      <Toggle label="Right to left approval" checked={rtl} onCheckedChange={setRtl} />
      <App direction={rtl ? 'rtl' : 'ltr'}>
        <VStack>
          <Form label="Approval form" onSubmit={() => setStatus('Approval saved.')}>
            <FormField
              name="approval"
              label="Account approval"
              required
              disabled={disabled}
            >
              <Checkbox
                label="Approve selected accounts"
                checked={checked}
                indeterminate={mixed}
                value="approved"
                readOnly={readOnly}
                description="Mixed selection must be resolved before submission."
                onCheckedChange={(next) => {
                  setChecked(next);
                  setMixed(false);
                }}
              />
            </FormField>
            <SubmitButton label="Save approval" />
          </Form>
          <Checkbox
            label="Approval reader"
            checked={checked}
            indeterminate={mixed}
            onCheckedChange={setChecked}
            readOnly
          />
          <Toggle
            label="Mixed approval state"
            checked={mixed}
            onCheckedChange={setMixed}
          />
          <Toggle
            label="Read-only approval"
            checked={readOnly}
            onCheckedChange={setReadOnly}
          />
          <Toggle
            label="Disable approval"
            checked={disabled}
            onCheckedChange={setDisabled}
          />
          <Button
            label="Reset approval"
            onPress={() => {
              setChecked(false);
              setMixed(true);
            }}
          />
          <Text>{`Approval state: ${approvalState}`}</Text>
          <Text>{status}</Text>
        </VStack>
      </App>
    </VStack>
  );
}
