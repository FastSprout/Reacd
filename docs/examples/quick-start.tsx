import { atom, useAtom } from 'jotai';
import { Button } from '@fastsprout/reacd';

const countAtom = atom(0);

export function QuickStartExample() {
  const [count, setCount] = useAtom(countAtom);
  return (
    <Button
      label={`Count: ${count}`}
      onPress={() => setCount(count + 1)}
    />
  );
}
