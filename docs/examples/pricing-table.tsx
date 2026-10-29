import { atom, useAtom } from 'jotai';
import { Button, PricingTable, Text, VStack } from 'reacd';

const chosenAtom = atom(false);

export function PricingTableExample() {
  const [chosen, setChosen] = useAtom(chosenAtom);
  return (
    <VStack>
      <Text>
        Illustrative comparison data, not product availability or a commercial offer.
      </Text>
      <PricingTable
        caption="Illustrative comparison table"
        tiers={[
          {
            id: 'first',
            title: 'First example tier',
            price: 'Example price',
            highlight: true,
            button: (
              <Button
                label="Choose comparison reference tier"
                onPress={() => setChosen(true)}
              />
            ),
          },
          {
            id: 'second',
            title: 'Second example tier',
            price: 'Another example price',
          },
        ]}
        sections={[
          {
            id: 'examples',
            title: 'Illustrative features',
            features: [
              {
                id: 'availability',
                title: 'Example inclusion',
                tiers: { first: true, second: false },
              },
              {
                id: 'detail',
                title: 'Example detail',
                tiers: { first: 'Explicit example', second: 2 },
              },
            ],
          },
        ]}
      />
      <Text>
        {chosen ? 'Comparison reference tier selected' : 'No comparison tier selected'}
      </Text>
    </VStack>
  );
}
