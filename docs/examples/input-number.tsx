import { atom, useAtom } from 'jotai';
import { App, Button, InputNumber, Text, Toggle, VStack } from '@fastsprout/reacd';

const rtlAtom = atom(false);
const valueAtom = atom<number | null>(0.1);
const readOnlyAtom = atom(false);
const QUANTITY_RANGE = { min: 0, max: 10, step: 0.1 } as const;

export function InputNumberExample() {
  const [value, setValue] = useAtom(valueAtom);
  const [readOnly, setReadOnly] = useAtom(readOnlyAtom);
  const [rtl, setRtl] = useAtom(rtlAtom);
  return (
    <VStack>
      <Toggle
        label="Right to left numeric field"
        checked={rtl}
        onCheckedChange={setRtl}
      />
      <App direction={rtl ? 'rtl' : 'ltr'}>
        <VStack>
          <InputNumber
            label="Quantity"
            description="Use decimal quantities up to ten."
            min={QUANTITY_RANGE.min}
            max={QUANTITY_RANGE.max}
            step={QUANTITY_RANGE.step}
            value={value}
            onValueChange={setValue}
            readOnly={readOnly}
            locale="en-US"
            name="quantity"
          />
          <Toggle
            label="Read-only quantity"
            checked={readOnly}
            onCheckedChange={setReadOnly}
          />
          <Button
            label="Clear quantity"
            onPress={() => setValue(null)}
            disabled={readOnly}
            intent="secondary"
          />
          <Text>{value === null ? 'Quantity is empty.' : `Quantity: ${value}`}</Text>
        </VStack>
      </App>
    </VStack>
  );
}
