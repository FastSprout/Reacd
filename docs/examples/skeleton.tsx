import { HStack, Skeleton } from '@fastsprout/reacd';

export function SkeletonExample() {
  return (
    <HStack>
      <Skeleton shape="avatar" />
      <Skeleton label="Loading profile" lines={2} />
    </HStack>
  );
}
