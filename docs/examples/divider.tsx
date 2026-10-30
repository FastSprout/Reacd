import { Divider, Text, VStack } from '@fastsprout/reacd';

export function DividerExample() {
  return (
    <VStack>
      <Text>Before the divider</Text>
      <Divider />
      <Text>After the divider</Text>
    </VStack>
  );
}
