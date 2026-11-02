import { atom, useAtom } from 'jotai';
import { App, Splitter, Input, Text, VStack, Toggle, Button } from '@fastsprout/reacd';
import type { SplitterProps } from '@fastsprout/reacd';

const INITIAL = [
  { id: 'outline', share: 50 },
  { id: 'document', share: 50 },
];
const layoutAtom = atom<SplitterProps['value']>(INITIAL);
const queryAtom = atom('Outline query');
const rtlAtom = atom(false);
const verticalAtom = atom(false);
const disabledAtom = atom(false);

export function SplitterExample() {
  const [value, setValue] = useAtom(layoutAtom);
  const [query, setQuery] = useAtom(queryAtom);
  const [rtl, setRtl] = useAtom(rtlAtom);
  const [vertical, setVertical] = useAtom(verticalAtom);
  const [disabled, setDisabled] = useAtom(disabledAtom);
  return (
    <VStack>
      <Toggle label="Splitter RTL" checked={rtl} onCheckedChange={setRtl} />
      <Toggle
        label="Vertical splitter"
        checked={vertical}
        onCheckedChange={setVertical}
      />
      <Toggle
        label="Disable resizing"
        checked={disabled}
        onCheckedChange={setDisabled}
      />
      <Button label="Reset panel shares" onPress={() => setValue(INITIAL)} />
      <App direction={rtl ? 'rtl' : 'ltr'}>
        <Splitter
          label="Document workspace"
          value={value}
          onValueChange={setValue}
          orientation={vertical ? 'vertical' : 'horizontal'}
          disabled={disabled}
          panels={[
            {
              id: 'outline',
              label: 'Document outline',
              minShare: 20,
              maxShare: 80,
              collapsedShare: 0,
              content: (
                <VStack>
                  <Input
                    label="Splitter outline query"
                    value={query}
                    onValueChange={setQuery}
                  />
                  <Text>{'Long_outline_label_'.repeat(16)}</Text>
                </VStack>
              ),
            },
            {
              id: 'document',
              label: 'Document content',
              minShare: 20,
              maxShare: 100,
              content: (
                <Text>
                  Resize with arrows, Shift, Home or End. Enter collapses the outline.
                  This is a local interactive fixture.
                </Text>
              ),
            },
          ]}
        />
      </App>
      {value.map((panel) => (
        <Text key={panel.id}>{`${panel.id} share: ${panel.share}`}</Text>
      ))}
    </VStack>
  );
}
