import { atom, useAtom } from 'jotai';
import { Button, PageLogos, Text, VStack } from 'reacd';

const reversedAtom = atom(false);
const placeholders = [
  { key: 'one', src: '/unavailable-logo-one.png', alt: 'First image placeholder' },
  { key: 'two', src: '/unavailable-logo-two.png', alt: 'Second image placeholder' },
] as const;

export function PageLogosExample() {
  const [reversed, setReversed] = useAtom(reversedAtom);
  return (
    <VStack>
      <Text>Explicit unavailable-image placeholders, not customer logos.</Text>
      <Button
        label="Reverse example marks"
        onPress={() => setReversed((value) => !value)}
      />
      <PageLogos
        label="Example placeholder marks"
        title="Image fallback examples"
        items={reversed ? [...placeholders].reverse() : placeholders}
      />
    </VStack>
  );
}
