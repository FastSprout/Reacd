import { atom, useAtom } from 'jotai';
import { Card, Form, Input, SubmitButton, Text } from '@fastsprout/reacd';

const amountAtom = atom('');
const statusAtom = atom('Preview a transfer without moving real money.');

export function TransferCard() {
  const [amount, setAmount] = useAtom(amountAtom);
  const [status, setStatus] = useAtom(statusAtom);
  return (
    <Card label="Transfer funds">
      <Text role="subheadline">Transfer funds</Text>
      <Text role="caption">Move money between sample accounts.</Text>
      <Form
        label="Sample transfer"
        onSubmit={() => setStatus(`Sample transfer prepared: ${amount} USD.`)}
      >
        <Input
          label="Transfer amount"
          value={amount}
          required
          placeholder="120.00"
          onValueChange={setAmount}
        />
        <Text role="caption">From: Main checking ·8402</Text>
        <Text role="caption">To: Savings ·1937</Text>
        <SubmitButton label="Prepare transfer" />
      </Form>
      <Text role="caption">{status}</Text>
    </Card>
  );
}
