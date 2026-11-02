import { atom, useAtom } from 'jotai';
import { Button, Form, PinInput, SubmitButton, Text, VStack } from '@fastsprout/reacd';

const valueAtom = atom('');
const statusAtom = atom('Enter a six-digit code.');
const CODE_LENGTH = 6;
const CODE_GROUP_LENGTH = 3;

export function PinInputExample() {
  const [value, setValue] = useAtom(valueAtom);
  const [status, setStatus] = useAtom(statusAtom);
  return (
    <VStack>
      <Form label="Code verification" onSubmit={() => setStatus('Code submitted.')}>
        <PinInput
          label="Verification code"
          value={value}
          onValueChange={setValue}
          length={CODE_LENGTH}
          separatorEvery={CODE_GROUP_LENGTH}
          description="Enter the six-digit code from your message."
          otp
          required
          name="code"
          onComplete={() => setStatus('Code is complete.')}
        />
        <SubmitButton label="Submit code" />
      </Form>
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
  );
}
