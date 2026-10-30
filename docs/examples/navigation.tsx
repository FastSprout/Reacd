import { atom, useAtom } from 'jotai';
import { Navigation, Text, VStack } from '@fastsprout/reacd';

const viewAtom = atom('summary');
const ITEMS = [
  { value: 'summary', label: 'Summary view' },
  { value: 'reports', label: 'Reports view' },
];

export function NavigationExample() {
  const [view, setView] = useAtom(viewAtom);
  return (
    <VStack>
      <Navigation
        label="Sample sections"
        items={ITEMS}
        value={view}
        onValueChange={setView}
      />
      <Text>{`Selected view: ${view}`}</Text>
    </VStack>
  );
}
