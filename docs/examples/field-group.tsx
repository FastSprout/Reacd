import { atom, useAtom } from 'jotai';
import { App, Button, FieldGroup, Input, Text, Toggle, VStack } from 'reacd';

const queryAtom = atom('');
const verticalAtom = atom(false);
const rtlAtom = atom(false);
const labelAtom = atom('Search reference');

export function FieldGroupExample() {
  const [query, setQuery] = useAtom(queryAtom);
  const [vertical, setVertical] = useAtom(verticalAtom);
  const [rtl, setRtl] = useAtom(rtlAtom);
  const [label, setLabel] = useAtom(labelAtom);
  return (
    <VStack>
      <Input label="Group action label" value={label} onValueChange={setLabel} />
      <Toggle
        label="Vertical field group"
        checked={vertical}
        onCheckedChange={setVertical}
      />
      <Toggle label="Right to left group" checked={rtl} onCheckedChange={setRtl} />
      <App direction={rtl ? 'rtl' : 'ltr'}>
        <FieldGroup
          label="Reference search controls"
          orientation={vertical ? 'vertical' : 'horizontal'}
        >
          <Input label="Reference query" value={query} onValueChange={setQuery} />
          <Button
            label={label.trim() || 'Search reference'}
            onPress={() => setQuery('Component reference')}
          />
          <Button label="Clear reference query" onPress={() => setQuery('')} />
        </FieldGroup>
      </App>
      <Text>{`Reference query: ${query}`}</Text>
    </VStack>
  );
}
