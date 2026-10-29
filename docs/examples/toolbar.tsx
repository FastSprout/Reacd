import { atom, useAtom } from 'jotai';
import { Button, Text, Toolbar, VStack } from 'reacd';

const savesAtom = atom(0);

export function ToolbarExample() {
  const [saves, setSaves] = useAtom(savesAtom);
  return (
    <VStack>
      <Toolbar label="Draft actions">
        <Button
          label="Save toolbar draft"
          onPress={() => setSaves((count) => count + 1)}
        />
      </Toolbar>
      <Text>{`Toolbar saves: ${saves}`}</Text>
    </VStack>
  );
}
