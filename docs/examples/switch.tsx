import { atom, useAtom } from 'jotai';
import { Form, SubmitButton, Switch, Text, VStack } from '@fastsprout/reacd';

const checkedAtom = atom(false);
const statusAtom = atom('Publishing is not saved.');

export function SwitchExample() {
  const [checked, setChecked] = useAtom(checkedAtom);
  const [status, setStatus] = useAtom(statusAtom);

  return (
    <VStack>
      <Form label="Publishing form" onSubmit={() => setStatus('Publishing saved.')}>
        <Switch
          label="Publish updates"
          description="Make updates visible to customers."
          checked={checked}
          onCheckedChange={setChecked}
          required
          name="publish"
        />
        <SubmitButton label="Save publishing" />
      </Form>
      <Text>{status}</Text>
    </VStack>
  );
}
