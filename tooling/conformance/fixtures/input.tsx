import { atom, useAtom } from 'jotai';
import {
  App,
  Button,
  Form,
  FormField,
  Input,
  SubmitButton,
  Text,
  Toggle,
  VStack,
} from '@fastsprout/reacd';

const SAMPLE_EMAIL = 'owner@example.com';
const emailAtom = atom(SAMPLE_EMAIL);
const readOnlyAtom = atom(false);
const loadingAtom = atom(false);
const disabledAtom = atom(false);
const rtlAtom = atom(false);
const statusAtom = atom('Contact is not saved.');

export function InputExample() {
  const [email, setEmail] = useAtom(emailAtom);
  const [readOnly, setReadOnly] = useAtom(readOnlyAtom);
  const [loading, setLoading] = useAtom(loadingAtom);
  const [disabled, setDisabled] = useAtom(disabledAtom);
  const [rtl, setRtl] = useAtom(rtlAtom);
  const [status, setStatus] = useAtom(statusAtom);
  return (
    <VStack>
      <Toggle label="Right to left email" checked={rtl} onCheckedChange={setRtl} />
      <App direction={rtl ? 'rtl' : 'ltr'}>
        <VStack>
          <Form label="Contact form" onSubmit={() => setStatus('Contact saved.')}>
            <FormField
              name="contact"
              label="Contact details"
              required
              disabled={disabled}
              help="The host owns account verification."
            >
              <Input
                label="Contact email"
                inputType="email"
                value={email}
                onValueChange={setEmail}
                minLength={4}
                maxLength={100}
                description="Enter the address used for account updates."
                autoComplete="email"
                readOnly={readOnly}
                loading={loading}
              />
            </FormField>
            <SubmitButton label="Save contact" />
          </Form>
          <Toggle
            label="Read-only email"
            checked={readOnly}
            onCheckedChange={setReadOnly}
          />
          <Toggle
            label="Updating email"
            checked={loading}
            onCheckedChange={setLoading}
          />
          <Toggle
            label="Disable email"
            checked={disabled}
            onCheckedChange={setDisabled}
          />
          <Button label="Clear contact email" onPress={() => setEmail('')} />
          <Button
            label="Restore contact email"
            onPress={() => setEmail(SAMPLE_EMAIL)}
          />
          <Text>{status}</Text>
        </VStack>
      </App>
    </VStack>
  );
}
