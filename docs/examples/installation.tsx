import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import '@fastsprout/reacd-shadcn/styles';
import { atom, useAtom } from 'jotai';
import { ReacdProvider, Text, Toggle, VStack } from '@fastsprout/reacd';

const enabledAtom = atom(false);

function InstallationView() {
  const [enabled, setEnabled] = useAtom(enabledAtom);
  return (
    <VStack>
      <Toggle label="Email summaries" checked={enabled} onCheckedChange={setEnabled} />
      <Text>{`Email summaries are ${enabled ? 'enabled' : 'disabled'}.`}</Text>
    </VStack>
  );
}

export function InstallationExample() {
  return (
    <ReacdProvider adapter={shadcnAdapter}>
      <InstallationView />
    </ReacdProvider>
  );
}
