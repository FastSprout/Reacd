import { atom, useAtom } from 'jotai';
import { Button, PageLogos, Text, VStack } from '@fastsprout/reacd';

const reversedAtom = atom(false);
const artwork = [
  { key: 'one', src: '/color-mode-light.svg', alt: 'Light appearance artwork' },
  { key: 'two', src: '/color-mode-dark.svg', alt: 'Dark appearance artwork' },
] as const;

export function PageLogosExample() {
  const [reversed, setReversed] = useAtom(reversedAtom);
  return (
    <VStack>
      <Text>Local documentation artwork, not customer endorsements.</Text>
      <Button
        label="Reverse example marks"
        onPress={() => setReversed((value) => !value)}
      />
      <PageLogos
        label="Documentation artwork"
        title="Appearance artwork"
        items={reversed ? [...artwork].reverse() : artwork}
      />
    </VStack>
  );
}
