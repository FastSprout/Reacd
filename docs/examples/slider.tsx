import { atom, useAtom } from 'jotai';
import { App, Form, Slider, SubmitButton, Text, Toggle, VStack } from 'reacd';

const levelAtom = atom(20);
const priceAtom = atom({ start: 20, end: 80 });
const readOnlyAtom = atom(false);
const disabledAtom = atom(false);
const rtlAtom = atom(false);
const statusAtom = atom('Sliders are not saved.');
const MINIMUM = 0;
const MAXIMUM = 100;

export function SliderExample() {
  const [level, setLevel] = useAtom(levelAtom);
  const [price, setPrice] = useAtom(priceAtom);
  const [readOnly, setReadOnly] = useAtom(readOnlyAtom);
  const [disabled, setDisabled] = useAtom(disabledAtom);
  const [rtl, setRtl] = useAtom(rtlAtom);
  const [status, setStatus] = useAtom(statusAtom);
  return (
    <VStack>
      <Toggle label="Right to left sliders" checked={rtl} onCheckedChange={setRtl} />
      <App direction={rtl ? 'rtl' : 'ltr'}>
        <VStack>
          <Form label="Slider form" onSubmit={() => setStatus('Sliders saved.')}>
            <Slider
              label="Output level"
              name="level"
              value={level}
              min={MINIMUM}
              max={MAXIMUM}
              onValueChange={setLevel}
              readOnly={readOnly}
              disabled={disabled}
            />
            <Slider
              mode="range"
              label="Price interval"
              name="price"
              value={price}
              min={MINIMUM}
              max={MAXIMUM}
              onValueChange={setPrice}
              description="Minimum and maximum retain their identities."
              readOnly={readOnly}
              disabled={disabled}
            />
            <SubmitButton label="Save sliders" />
          </Form>
          <Slider
            label="Vertical output"
            value={level}
            min={MINIMUM}
            max={MAXIMUM}
            orientation="vertical"
            onValueChange={setLevel}
            readOnly={readOnly}
            disabled={disabled}
          />
          <Toggle
            label="Read-only sliders"
            checked={readOnly}
            onCheckedChange={setReadOnly}
          />
          <Toggle
            label="Disable sliders"
            checked={disabled}
            onCheckedChange={setDisabled}
          />
          <Text>{status}</Text>
        </VStack>
      </App>
    </VStack>
  );
}
