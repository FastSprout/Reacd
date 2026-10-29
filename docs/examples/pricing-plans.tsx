import { atom, useAtom } from 'jotai';
import { Button, PricingPlan, PricingPlans, Text, Toggle, VStack } from 'reacd';

const verticalAtom = atom(false);
const compactAtom = atom(false);
const scaleAtom = atom(false);
const chosenAtom = atom('None');

export function PricingPlansExample() {
  const [vertical, setVertical] = useAtom(verticalAtom);
  const [compact, setCompact] = useAtom(compactAtom);
  const [scale, setScale] = useAtom(scaleAtom);
  const [chosen, setChosen] = useAtom(chosenAtom);
  return (
    <VStack>
      <Toggle
        label="Vertical pricing collection"
        checked={vertical}
        onCheckedChange={setVertical}
      />
      <Toggle
        label="Compact pricing collection"
        checked={compact}
        onCheckedChange={setCompact}
      />
      <Toggle
        label="Prominent collection plans"
        checked={scale}
        onCheckedChange={setScale}
      />
      <PricingPlans
        orientation={vertical ? 'vertical' : 'horizontal'}
        compact={compact}
        scale={scale}
        plans={[
          {
            key: 'first',
            title: 'First illustrative collection plan',
            price: 'Example price',
            description: 'A keyed reference record, not an offer.',
            button: (
              <Button
                label="Choose first reference plan"
                onPress={() => setChosen('First')}
              />
            ),
          },
        ]}
      >
        <PricingPlan
          title="Supplemental collection plan"
          scale={false}
          button={
            <Button
              label="Choose supplemental reference plan"
              onPress={() => setChosen('Supplemental')}
            />
          }
        />
      </PricingPlans>
      <Text>{`Selected reference plan: ${chosen}`}</Text>
    </VStack>
  );
}
