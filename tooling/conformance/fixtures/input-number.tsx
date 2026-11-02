import { atom, useAtom } from 'jotai';
import {
  App, Button, Form, InputNumber, SubmitButton, Text, Toggle, VStack,
} from '@fastsprout/reacd';

const rtlAtom = atom(false);
const valueAtom = atom<number | null>(0.1);
const readOnlyAtom = atom(false);
const pendingAtom = atom(false);
const statusAtom = atom('Quantity is not saved.');
const QUANTITY_RANGE = { min: 0, max: 10, step: 0.1 } as const;

export function InputNumberExample() {
  const [value, setValue] = useAtom(valueAtom);
  const [readOnly, setReadOnly] = useAtom(readOnlyAtom);
  const [rtl, setRtl] = useAtom(rtlAtom);
  const [pending, setPending] = useAtom(pendingAtom);
  const [status, setStatus] = useAtom(statusAtom);
  return (
    <VStack>
      <Toggle
        label="Right to left numeric field"
        checked={rtl}
        onCheckedChange={setRtl}
      />
      <Toggle label="Submitting quantity" checked={pending}
        onCheckedChange={setPending} />
      <App direction={rtl ? 'rtl' : 'ltr'}>
        <VStack>
          <Form label="Quantity form" submitting={pending}
            onSubmit={() => setStatus('Quantity saved.')}>
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
            <SubmitButton label="Save quantity" />
          </Form>
          <Text>{status}</Text>
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
