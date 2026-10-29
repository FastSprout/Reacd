import { atom, useAtom } from 'jotai';
import { Progress, Slider, Toggle, VStack } from 'reacd';
const INITIAL_ITEMS = 125;
const MAXIMUM_ITEMS = 500;
const valueAtom = atom<number | null>(INITIAL_ITEMS);
const showAtom = atom(true);
export function ProgressExample() {
  const [value, setValue] = useAtom(valueAtom);
  const [showValue, setShowValue] = useAtom(showAtom);
  return (
    <VStack>
      <Progress
        label="Uploaded items"
        description="Progress across the current batch."
        value={value}
        max={MAXIMUM_ITEMS}
        showValue={showValue}
      />
      <Slider
        label="Uploaded item count"
        value={value ?? 0}
        min={0}
        max={MAXIMUM_ITEMS}
        onValueChange={setValue}
        disabled={value === null}
      />
      <Toggle
        label="Indeterminate upload"
        checked={value === null}
        onCheckedChange={(next) => setValue(next ? null : INITIAL_ITEMS)}
      />
      <Toggle
        label="Show progress value"
        checked={showValue}
        onCheckedChange={setShowValue}
      />
    </VStack>
  );
}
