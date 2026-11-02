import { atom, useAtom } from 'jotai';
import { Card, Form, Input, SubmitButton, Text } from '@fastsprout/reacd';

const emailAtom = atom('');
const statusAtom = atom('Invite a teammate to this sample workspace.');

export function InvitationCard() {
  const [email, setEmail] = useAtom(emailAtom);
  const [status, setStatus] = useAtom(statusAtom);
  return (
    <Card label="Team invitation">
      <Text role="subheadline">Invite your team</Text>
      <Form
        label="Team invitation"
        onSubmit={() => setStatus(`Invitation prepared for ${email}.`)}
      >
        <Input
          label="Work email"
          name="email"
          inputType="email"
          required
          value={email}
          onValueChange={setEmail}
        />
        <SubmitButton label="Prepare invitation" />
      </Form>
      <Text role="caption">{status}</Text>
    </Card>
  );
}
