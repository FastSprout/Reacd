import { Badge, HStack, Text } from 'reacd';

export function HStackExample() {
  return (
    <HStack spacing="small">
      <Text>Review workflow</Text>
      <Badge label="Ready for review" />
    </HStack>
  );
}
