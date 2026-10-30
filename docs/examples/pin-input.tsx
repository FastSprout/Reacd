import { atom, useAtom } from 'jotai';
import {
  App,
  Button,
  Form,
  PinInput,
  SubmitButton,
  Text,
  Toggle,
  VStack,
} from '@fastsprout/reacd';

const rtlAtom = atom(false);
const valueAtom = atom('');
const maskAtom = atom(false);
const statusAtom = atom('Enter a six-digit code.');
const CODE_LENGTH = 6;
const CODE_GROUP_LENGTH = 3;

export function PinInputExample() {
  const [value, setValue] = useAtom(valueAtom);
  const [mask, setMask] = useAtom(maskAtom);
  const [status, setStatus] = useAtom(statusAtom);
  const [rtl, setRtl] = useAtom(rtlAtom);
  return (
    <VStack>
      <Toggle label="Right to left PIN field" checked={rtl} onCheckedChange={setRtl} />
      <App direction={rtl ? 'rtl' : 'ltr'}>
        <VStack>
          <Form label="Code verification" onSubmit={() => setStatus('Code submitted.')}>
            <PinInput
              label="Verification code"
              value={value}
              onValueChange={setValue}
              length={CODE_LENGTH}
              separatorEvery={CODE_GROUP_LENGTH}
              mask={mask}
              description="Paste a code or enter each digit."
              otp
              required
              name="code"
              onComplete={() => setStatus('Code is complete.')}
            />
            <SubmitButton label="Submit code" />
          </Form>
          <Toggle label="Mask code" checked={mask} onCheckedChange={setMask} />
          <Button
            label="Clear code"
            intent="secondary"
            onPress={() => {
              setValue('');
              setStatus('Enter a six-digit code.');
            }}
          />
          <Text>{status}</Text>
        </VStack>
      </App>
    </VStack>
  );
}
