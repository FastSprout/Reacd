import { Divider, Text, VStack } from 'reacd';

export function DividerExample() {
  return (
    <VStack>
      <Text>Before the divider</Text>
      <Divider />
      <Text>After the divider</Text>
    </VStack>
  );
}
