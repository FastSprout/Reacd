import { atom, useAtom } from 'jotai';
import { Form, SubmitButton, Switch, Text, Toggle, VStack } from '@fastsprout/reacd';

const checkedAtom = atom(false);
const readOnlyAtom = atom(false);
const loadingAtom = atom(false);
const statusAtom = atom('Publishing is not saved.');

export function SwitchExample() {
  const [checked, setChecked] = useAtom(checkedAtom);
  const [readOnly, setReadOnly] = useAtom(readOnlyAtom);
  const [loading, setLoading] = useAtom(loadingAtom);
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
          readOnly={readOnly}
          loading={loading}
        />
        <SubmitButton label="Save publishing" />
      </Form>
      <Toggle
        label="Read-only publishing"
        checked={readOnly}
        onCheckedChange={setReadOnly}
      />
      <Toggle
        label="Updating publishing"
        checked={loading}
        onCheckedChange={setLoading}
      />
      <Text>{status}</Text>
    </VStack>
  );
}
