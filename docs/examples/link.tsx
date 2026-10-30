import { Link, VStack } from '@fastsprout/reacd';

export function LinkExample() {
  return (
    <VStack>
      <Link label="Current catalog" href="/" active />
      <Link label="Open catalog in new window" href="/" newWindow />
      <Link label="Unavailable destination" href="/" disabled />
    </VStack>
  );
}
