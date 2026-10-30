import { Separator, Text, VStack } from '@fastsprout/reacd';

export function SeparatorExample() {
  return (
    <VStack>
      <Text>Account settings</Text>
      <Separator label="Notification preferences" position="start" lineStyle="dashed" />
      <Text>Delivery settings</Text>
    </VStack>
  );
}
