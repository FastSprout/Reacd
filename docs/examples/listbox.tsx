import { atom, useAtom } from 'jotai';
import { Listbox } from '@fastsprout/reacd';

const regionAtom = atom('north');
const regions = [
  { value: 'north', label: 'North' },
  { value: 'west', label: 'West' },
  { value: 'south', label: 'South' },
];

export function ListboxExample() {
  const [region, setRegion] = useAtom(regionAtom);

  return (
    <Listbox
      label="Delivery region"
      items={regions}
      value={region}
      onValueChange={setRegion}
    />
  );
}
