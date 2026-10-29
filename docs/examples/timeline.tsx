import { atom, useAtom } from 'jotai';
import { App, Section, Text, Timeline, Toggle, VStack } from 'reacd';

const currentAtom = atom('design');
const reverseAtom = atom(false);
const horizontalAtom = atom(false);
const rtlAtom = atom(false);
const EVENTS = [
  {
    id: 'design',
    title: 'Design review',
    date: 'March 22',
    description: 'Agree on the interaction contract.',
  },
  { id: 'build', title: 'Implementation', date: 'March 29' },
  { id: 'ship', title: 'Release review', disabled: true },
];
export function TimelineExample() {
  const [current, setCurrent] = useAtom(currentAtom);
  const [reverse, setReverse] = useAtom(reverseAtom);
  const [horizontal, setHorizontal] = useAtom(horizontalAtom);
  const [rtl, setRtl] = useAtom(rtlAtom);
  return (
    <Section title="Delivery timeline preview">
      <VStack>
        <Toggle
          label="Reverse timeline"
          checked={reverse}
          onCheckedChange={setReverse}
        />
        <Toggle
          label="Horizontal timeline"
          checked={horizontal}
          onCheckedChange={setHorizontal}
        />
        <Toggle label="Right to left timeline" checked={rtl} onCheckedChange={setRtl} />
        <App direction={rtl ? 'rtl' : 'ltr'}>
          <Timeline
            label="Delivery milestones"
            items={EVENTS}
            value={current}
            onValueChange={setCurrent}
            reverse={reverse}
            orientation={horizontal ? 'horizontal' : 'vertical'}
          />
        </App>
        <Text>{`Current milestone: ${current}`}</Text>
      </VStack>
    </Section>
  );
}
