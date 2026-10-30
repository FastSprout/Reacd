import { atom, useAtom } from 'jotai';
import { AuthForm, Input, Select, Text, Toggle, VStack } from '@fastsprout/reacd';

const emailAtom = atom('');
const roleAtom = atom('reader');
const loadingAtom = atom(false);
const disabledAtom = atom(false);
const resultAtom = atom('No local action yet');

export function AuthFormExample() {
  const [email, setEmail] = useAtom(emailAtom);
  const [role, setRole] = useAtom(roleAtom);
  const [loading, setLoading] = useAtom(loadingAtom);
  const [disabled, setDisabled] = useAtom(disabledAtom);
  const [result, setResult] = useAtom(resultAtom);
  return (
    <VStack>
      <Toggle
        label="Auth example loading"
        checked={loading}
        onCheckedChange={setLoading}
      />
      <Toggle
        label="Auth example disabled"
        checked={disabled}
        onCheckedChange={setDisabled}
      />
      <AuthForm
        label="Local credential example"
        title="Local form demonstration"
        description="No authentication or network request occurs."
        submitLabel="Submit local example"
        loading={loading}
        disabled={disabled}
        onSubmit={() => setResult(`Local example submitted: ${email}`)}
        providers={[
          {
            key: 'local',
            label: 'Run local provider example',
            onPress: () => setResult('Local provider example selected'),
          },
        ]}
        separatorLabel="Or complete the local fields"
        footer={<Text>{result}</Text>}
      >
        <Select
          label="Example role"
          value={role}
          onValueChange={setRole}
          items={[
            { value: 'reader', label: 'Reader' },
            { value: 'administrator', label: 'Administrator' },
          ]}
        />
        <Text>{`Example role: ${role}`}</Text>
        <Input
          label="Example email"
          inputType="email"
          required
          value={email}
          onValueChange={setEmail}
        />
      </AuthForm>
    </VStack>
  );
}
