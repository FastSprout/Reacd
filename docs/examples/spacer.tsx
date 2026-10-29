import { HStack, Spacer, Text } from 'reacd';

export function SpacerExample() {
  return (
    <HStack>
      <Text>Start of row</Text>
      <Spacer />
      <Text>End of row</Text>
    </HStack>
  );
}
