import { atom, useAtom } from 'jotai';
import {
  Button,
  CheckboxGroup,
  Form,
  SubmitButton,
  Text,
  Toggle,
  VStack,
} from '@fastsprout/reacd';

const valueAtom = atom<readonly string[]>([]);
const disabledAtom = atom(false);
const horizontalAtom = atom(false);
const statusAtom = atom('No channels saved.');
const CHANNEL_LIMIT = 2;
const DESCRIPTION_REPETITIONS = 12;
const ITEMS = [
  {
    value: 'email',
    label: 'Email notifications',
    description:
      'Notification details: ' +
      'notification_configuration_'.repeat(DESCRIPTION_REPETITIONS),
  },
  { value: 'sms', label: 'SMS notifications', description: 'Text messages.' },
  { value: 'inApp', label: 'In-app notifications' },
  { value: 'unavailable', label: 'Unavailable channel', disabled: true },
];
export function CheckboxGroupExample() {
  const [value, setValue] = useAtom(valueAtom);
  const [disabled, setDisabled] = useAtom(disabledAtom);
  const [horizontal, setHorizontal] = useAtom(horizontalAtom);
  const [status, setStatus] = useAtom(statusAtom);
  return (
    <VStack>
      <Toggle
        label="Disable channel choices"
        checked={disabled}
        onCheckedChange={setDisabled}
      />
      <Toggle
        label="Arrange channels horizontally"
        checked={horizontal}
        onCheckedChange={setHorizontal}
      />
      <Form
        label="Channels example"
        onSubmit={() => setStatus(`Saved channels: ${value.join(', ')}`)}
      >
        <CheckboxGroup
          label="Notification channels"
          description="Choose notification channels."
          value={value}
          onValueChange={setValue}
          items={ITEMS}
          max={CHANNEL_LIMIT}
          required
          disabled={disabled}
          orientation={horizontal ? 'horizontal' : 'vertical'}
        />
        <SubmitButton label="Save channels" />
        <Button
          label="Clear channels"
          intent="secondary"
          onPress={() => setValue([])}
        />
        <Text>{status}</Text>
      </Form>
    </VStack>
  );
}
