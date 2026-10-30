import { atom, useAtom } from 'jotai';
import { Input, Section, Stepper, Text, Toggle, VStack } from '@fastsprout/reacd';

const stepAtom = atom('address');
const linearAtom = atom(true);
const disabledAtom = atom(false);
const verticalAtom = atom(false);
const addressAtom = atom('Sample address');

export function StepperExample() {
  const [value, setValue] = useAtom(stepAtom);
  const [linear, setLinear] = useAtom(linearAtom);
  const [disabled, setDisabled] = useAtom(disabledAtom);
  const [vertical, setVertical] = useAtom(verticalAtom);
  const [address, setAddress] = useAtom(addressAtom);
  return (
    <Section title="Stepper preview">
      <VStack>
        <Toggle
          label="Linear sample steps"
          checked={linear}
          onCheckedChange={setLinear}
        />
        <Toggle
          label="Disable sample steps"
          checked={disabled}
          onCheckedChange={setDisabled}
        />
        <Toggle
          label="Vertical sample steps"
          checked={vertical}
          onCheckedChange={setVertical}
        />
        <Stepper
          label="Sample checkout"
          value={value}
          onValueChange={setValue}
          linear={linear}
          disabled={disabled}
          orientation={vertical ? 'vertical' : 'horizontal'}
          items={[
            {
              key: 'address',
              title: 'Sample address',
              description: 'Edit a retained field.',
              content: (
                <Input
                  label="Sample shipping address"
                  value={address}
                  onValueChange={setAddress}
                />
              ),
            },
            {
              key: 'payment',
              title: 'Sample payment',
              content: <Text>No payment service is connected in this example.</Text>,
            },
            {
              key: 'confirm',
              title: 'Sample confirmation',
              content: <Text>Sample checkout reached confirmation.</Text>,
            },
          ]}
        />
      </VStack>
    </Section>
  );
}
