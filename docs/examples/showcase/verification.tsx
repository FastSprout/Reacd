import { Card, Text } from '@fastsprout/reacd';
import { PinInputExample } from '../pin-input.js';

export function VerificationCard() {
  return (
    <Card label="Verify your account">
      <Text role="subheadline">Verify your account</Text>
      <PinInputExample />
    </Card>
  );
}
