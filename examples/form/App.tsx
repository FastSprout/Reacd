import { atom, useAtom } from 'jotai';
import {
  Button,
  Form,
  Input,
  Page,
  ReacdProvider,
  SubmitButton,
  Text,
  VStack,
} from '@fastsprout/reacd';

const nameAtom = atom('');
const statusAtom = atom('No contact saved.');

function ContactForm() {
  const [name, setName] = useAtom(nameAtom);
  const [status, setStatus] = useAtom(statusAtom);
  return (
    <Page title="Contact form" subtitle="Sample data stays in the browser.">
      <VStack>
        <Form
          label="Contact details"
          onSubmit={() => setStatus(`Saved contact for ${name}.`)}
        >
          <Input
            label="Contact name"
            name="contactName"
            value={name}
            onValueChange={setName}
            required
          />
          <SubmitButton label="Save contact" />
        </Form>
        <Button
          label="Clear contact"
          onPress={() => {
            setName('');
            setStatus('No contact saved.');
          }}
        />
        <Text>{status}</Text>
      </VStack>
    </Page>
  );
}

export function App() {
  return (
    <ReacdProvider>
      <ContactForm />
    </ReacdProvider>
  );
}
