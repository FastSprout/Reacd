import { Text, VStack } from 'reacd';

export function TextExample() {
  return (
    <VStack>
      <Text role="headline">Delivery status</Text>
      <Text weight="medium">All routes are ready.</Text>
      <Text lineLimit={1}>
        The northern regional delivery schedule remains available for review.
      </Text>
    </VStack>
  );
}
