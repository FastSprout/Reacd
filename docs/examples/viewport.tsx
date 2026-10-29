import { atom, useAtom } from 'jotai';
import { Text, Toggle, Viewport, VStack } from 'reacd';

const compactAtom = atom(false);

export function ViewportExample() {
  const [compact, setCompact] = useAtom(compactAtom);
  return (
    <VStack>
      <Toggle
        label="Constrain sample viewport"
        checked={compact}
        onCheckedChange={setCompact}
      />
      <Viewport compact={compact}>
        <Text>Viewport content remains available.</Text>
      </Viewport>
      <Text>{`Viewport mode: ${compact ? 'compact' : 'regular'}`}</Text>
    </VStack>
  );
}
