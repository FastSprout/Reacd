import { atom, useAtom } from 'jotai';
import {
  Button,
  Form,
  RadioGroup,
  SubmitButton,
  Text,
  Toggle,
  VStack,
} from '@fastsprout/reacd';

const valueAtom = atom('');
const disabledAtom = atom(false);
const horizontalAtom = atom(false);
const statusAtom = atom('No delivery saved.');
const DESCRIPTION_REPETITIONS = 12;
const ITEMS = [
  {
    value: 'standard',
    label: 'Standard delivery',
    description:
      'Delivery details: ' + 'delivery_configuration_'.repeat(DESCRIPTION_REPETITIONS),
  },
  { value: 'unavailable', label: 'Unavailable pickup', disabled: true },
  { value: 'express', label: 'Express delivery', description: 'Priority handling.' },
];
export function RadioGroupExample() {
  const [value, setValue] = useAtom(valueAtom);
  const [disabled, setDisabled] = useAtom(disabledAtom);
  const [horizontal, setHorizontal] = useAtom(horizontalAtom);
  const [status, setStatus] = useAtom(statusAtom);
  return (
    <VStack>
      <Toggle
        label="Disable delivery choices"
        checked={disabled}
        onCheckedChange={setDisabled}
      />
      <Toggle
        label="Arrange delivery horizontally"
        checked={horizontal}
        onCheckedChange={setHorizontal}
      />
      <Form
        label="Delivery example"
        onSubmit={() => setStatus(`Saved delivery: ${value}`)}
      >
        <RadioGroup
          label="Delivery method"
          description="Choose one delivery method."
          value={value}
          onValueChange={setValue}
          items={ITEMS}
          required
          disabled={disabled}
          orientation={horizontal ? 'horizontal' : 'vertical'}
        />
        <SubmitButton label="Save delivery" />
        <Button
          label="Clear delivery"
          intent="secondary"
          onPress={() => setValue('')}
        />
        <Text>{status}</Text>
      </Form>
    </VStack>
  );
}
