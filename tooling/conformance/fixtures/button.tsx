import { atom, useAtom } from 'jotai';
import { Button, Text, Toggle, VStack } from '@fastsprout/reacd';
const countAtom = atom(0);
const loadingAtom = atom(false);
const disabledAtom = atom(false);

export function ButtonExample() {
  const [count, setCount] = useAtom(countAtom);
  const [loading, setLoading] = useAtom(loadingAtom);
  const [disabled, setDisabled] = useAtom(disabledAtom);
  return (
    <VStack>
      <Button
        label="Request export"
        loadingLabel="Requesting export"
        leadingIcon="download"
        trailingIcon="external"
        loading={loading}
        disabled={disabled}
        onPress={() => setCount(count + 1)}
      />
      <Toggle
        label="Busy export button"
        checked={loading}
        onCheckedChange={setLoading}
      />
      <Toggle
        label="Disable export button"
        checked={disabled}
        onCheckedChange={setDisabled}
      />
      <Text>{`Export requests: ${count}`}</Text>
    </VStack>
  );
}
