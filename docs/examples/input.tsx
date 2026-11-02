import { atom, useAtom } from 'jotai';
import { Form, Input, SubmitButton, Text, VStack } from '@fastsprout/reacd';

const emailAtom = atom('owner@example.com');
const statusAtom = atom('Contact is not saved.');

export function InputExample() {
  const [email, setEmail] = useAtom(emailAtom);
  const [status, setStatus] = useAtom(statusAtom);

  return (
    <VStack>
      <Form label="Contact form" onSubmit={() => setStatus('Contact saved.')}>
        <Input
          label="Contact email"
          inputType="email"
          description="Enter the address used for account updates."
          autoComplete="email"
          name="contact"
          value={email}
          onValueChange={setEmail}
          required
        />
        <SubmitButton label="Save contact" />
      </Form>
      <Text>{status}</Text>
    </VStack>
  );
}
