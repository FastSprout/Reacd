import { atom, useAtom } from 'jotai';
import { Button, Input, PricingPlan, Text, Toggle, VStack } from 'reacd';

const selectedAtom = atom(false);
const draftAtom = atom('');
const scaleAtom = atom(false);

export function PricingPlanExample() {
  const [selected, setSelected] = useAtom(selectedAtom);
  const [draft, setDraft] = useAtom(draftAtom);
  const [scale, setScale] = useAtom(scaleAtom);
  return (
    <VStack>
      <Toggle
        label="Prominent example plan"
        checked={scale}
        onCheckedChange={setScale}
      />
      <PricingPlan
        title="Illustrative pricing plan"
        description="Example data, not an offer."
        price="Example original price"
        discount="Example discounted price"
        billingCycle="Example period"
        billingPeriod="Example billing context"
        terms="Illustrative terms only"
        tagline="Component reference"
        badge={<Text>Example badge</Text>}
        highlight
        scale={scale}
        features={[
          'Example plain feature',
          {
            key: 'keyed',
            title: 'Example keyed feature',
            leading: <Text>Example category</Text>,
          },
        ]}
        button={
          <Button label="Select illustrative plan" onPress={() => setSelected(true)} />
        }
        footer={
          <Text>{selected ? 'Illustrative plan selected' : 'No plan selected'}</Text>
        }
      >
        <Input label="Pricing plan draft" value={draft} onValueChange={setDraft} />
      </PricingPlan>
    </VStack>
  );
}
