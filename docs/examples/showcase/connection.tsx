import { atom, useAtom } from 'jotai';
import { Button, Card, Text } from '@fastsprout/reacd';

const connectedAtom = atom(false);

export function ConnectionCard() {
  const [connected, setConnected] = useAtom(connectedAtom);
  return (
    <Card label="Connect your account">
      <Text role="subheadline">Connect your account</Text>
      <Text>Try a connection without linking a real service.</Text>
      <Button
        label={connected ? 'Disconnect account' : 'Connect account'}
        intent={connected ? 'secondary' : 'primary'}
        onPress={() => setConnected(!connected)}
      />
      <Text role="caption">
        {connected ? 'Sample account connected.' : 'No account connected.'}
      </Text>
    </Card>
  );
}
