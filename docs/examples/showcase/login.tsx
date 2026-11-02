import { atom, useAtom } from 'jotai';
import { AuthForm, Card, Input, Text } from '@fastsprout/reacd';

const emailAtom = atom('');
const passwordAtom = atom('');
const statusAtom = atom('Try the credential form locally.');

export function LoginCard() {
  const [email, setEmail] = useAtom(emailAtom);
  const [password, setPassword] = useAtom(passwordAtom);
  const [status, setStatus] = useAtom(statusAtom);
  return (
    <Card label="Login">
      <AuthForm
        label="Local sign-in"
        title="Login"
        submitLabel="Continue locally"
        onSubmit={() => setStatus('Local sign-in form completed.')}
        footer={<Text>{status}</Text>}
      >
        <Input
          label="Account email"
          inputType="email"
          autoComplete="email"
          value={email}
          onValueChange={setEmail}
          required
        />
        <Input
          label="Account password"
          inputType="password"
          autoComplete="current-password"
          value={password}
          onValueChange={setPassword}
          required
        />
      </AuthForm>
    </Card>
  );
}
