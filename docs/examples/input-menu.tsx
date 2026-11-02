import { atom, useAtom } from 'jotai';
import { InputMenu } from '@fastsprout/reacd';

const destinationAtom = atom('');
const destinations = [
  { value: 'krakow', label: 'Kraków' },
  { value: 'paris', label: 'Paris' },
  { value: 'lisbon', label: 'Lisbon' },
];

export function InputMenuExample() {
  const [destination, setDestination] = useAtom(destinationAtom);

  return (
    <InputMenu
      label="Destination"
      description="Choose a suggestion or enter another city."
      items={destinations}
      value={destination}
      onValueChange={setDestination}
    />
  );
}
