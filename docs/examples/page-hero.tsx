import { atom, useAtom } from 'jotai';
import { Input, PageHero, Text, Toggle, VStack } from 'reacd';

const reverseAtom = atom(false);
const horizontalAtom = atom(true);
const draftAtom = atom('');
const LONG_TITLE = 'PageHeroRetainsReadableLongUnbrokenContentAcrossNarrowScreens';

export function PageHeroExample() {
  const [reverse, setReverse] = useAtom(reverseAtom);
  const [horizontal, setHorizontal] = useAtom(horizontalAtom);
  const [draft, setDraft] = useAtom(draftAtom);
  return (
    <VStack>
      <Toggle
        label="Reverse hero regions"
        checked={reverse}
        onCheckedChange={setReverse}
      />
      <Toggle
        label="Horizontal hero preference"
        checked={horizontal}
        onCheckedChange={setHorizontal}
      />
      <PageHero
        title={LONG_TITLE}
        headline="Responsive composition example"
        description="The engine owns wrapping and track sizing."
        orientation={horizontal ? 'horizontal' : 'vertical'}
        reverse={reverse}
        top={<Text>Hero top slot</Text>}
        bottom={<Text>Hero bottom slot</Text>}
        header={<Text>Hero header slot</Text>}
        footer={<Text>Hero footer slot</Text>}
      >
        <Input label="Page hero draft" value={draft} onValueChange={setDraft} />
      </PageHero>
    </VStack>
  );
}
