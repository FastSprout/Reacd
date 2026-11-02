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
const longAtom = atom(false);
const alphanumericAtom = atom(false);
const groupedAtom = atom(true);
const pendingAtom = atom(false);
const CODE_LENGTH = 6;
const LONG_CODE_LENGTH = 12;
const CODE_GROUP_LENGTH = 3;

export function PinInputExample() {
  const [value, setValue] = useAtom(valueAtom);
  const [mask, setMask] = useAtom(maskAtom);
  const [status, setStatus] = useAtom(statusAtom);
  const [rtl, setRtl] = useAtom(rtlAtom);
  const [long, setLong] = useAtom(longAtom);
  const [alphanumeric, setAlphanumeric] = useAtom(alphanumericAtom);
  const [grouped, setGrouped] = useAtom(groupedAtom);
  const [pending, setPending] = useAtom(pendingAtom);
  return (
    <VStack>
      <Toggle label="Right to left PIN field" checked={rtl} onCheckedChange={setRtl} />
      <Toggle
        label="Twelve-character code"
        checked={long}
        onCheckedChange={(next) => {
          setValue('');
          setLong(next);
        }}
      />
      <Toggle
        label="Alphanumeric code"
        checked={alphanumeric}
        onCheckedChange={(next) => {
          setValue('');
          setAlphanumeric(next);
        }}
      />
      <Toggle label="Group code slots" checked={grouped} onCheckedChange={setGrouped} />
      <Toggle label="Submitting code" checked={pending} onCheckedChange={setPending} />
      <App direction={rtl ? 'rtl' : 'ltr'}>
        <VStack>
          <Form
            label="Code verification"
            submitting={pending}
            onSubmit={() => setStatus('Code submitted.')}
          >
            <PinInput
              label="Verification code"
              value={value}
              onValueChange={setValue}
              length={long ? LONG_CODE_LENGTH : CODE_LENGTH}
              inputType={alphanumeric ? 'alphanumeric' : 'numeric'}
              separatorEvery={grouped ? CODE_GROUP_LENGTH : undefined}
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
