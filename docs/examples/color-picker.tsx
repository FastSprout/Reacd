import { atom, useAtom } from 'jotai';
import {
  App,
  Button,
  ColorPicker,
  Form,
  SubmitButton,
  Text,
  Toggle,
  VStack,
} from 'reacd';
const colorAtom = atom('#33aa6680');
const readonlyAtom = atom(false);
const disabledAtom = atom(false);
const rejectAtom = atom(false);
const rtlAtom = atom(false);
const statusAtom = atom('Color is not saved.');
const PRESETS = [
  { label: 'Green preset', value: '#33aa6680' },
  { label: 'Black preset', value: '#000000ff' },
  { label: 'Transparent preset', value: '#00000000' },
];
export function ColorPickerExample() {
  const [value, setValue] = useAtom(colorAtom);
  const [readOnly, setReadOnly] = useAtom(readonlyAtom);
  const [disabled, setDisabled] = useAtom(disabledAtom);
  const [reject, setReject] = useAtom(rejectAtom);
  const [rtl, setRtl] = useAtom(rtlAtom);
  const [status, setStatus] = useAtom(statusAtom);
  return (
    <VStack>
      <Toggle label="Right to left colors" checked={rtl} onCheckedChange={setRtl} />
      <App direction={rtl ? 'rtl' : 'ltr'}>
        <VStack>
          <Form label="Color form" onSubmit={() => setStatus('Color saved.')}>
            <ColorPicker
              mode="rgba"
              label="Reference color"
              value={value}
              onValueChange={(next) => {
                if (!reject) setValue(next);
              }}
              name="color"
              description="Choose the stored color and opacity."
              presets={PRESETS}
              readOnly={readOnly}
              disabled={disabled}
            />
            <SubmitButton label="Save color" />
          </Form>
          <Toggle
            label="Read-only color"
            checked={readOnly}
            onCheckedChange={setReadOnly}
          />
          <Toggle
            label="Disable color"
            checked={disabled}
            onCheckedChange={setDisabled}
          />
          <Toggle
            label="Reject color changes"
            checked={reject}
            onCheckedChange={setReject}
          />
          <Button label="Restore sample color" onPress={() => setValue('#33aa6680')} />
          <Text>{value}</Text>
          <Text>{status}</Text>
        </VStack>
      </App>
    </VStack>
  );
}
