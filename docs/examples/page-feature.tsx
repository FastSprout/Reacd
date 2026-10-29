import { atom, useAtom } from 'jotai';
import { Button, PageFeature, Text } from 'reacd';

const inspectedAtom = atom(false);
const expandedAtom = atom(false);

export function PageFeatureExample() {
  const [inspected, setInspected] = useAtom(inspectedAtom);
  const [expanded, setExpanded] = useAtom(expandedAtom);
  return (
    <PageFeature
      title="Inspect feature details"
      description="The title and child control trigger independent actions."
      leading={<Text weight="bold">Action composition</Text>}
      onPress={() => setInspected(true)}
    >
      <Button
        label="Toggle feature explanation"
        onPress={() => setExpanded(!expanded)}
      />
      <Text>{inspected ? 'Feature inspected' : 'Feature awaiting inspection'}</Text>
      <Text>
        {expanded ? 'Feature explanation expanded' : 'Feature explanation collapsed'}
      </Text>
    </PageFeature>
  );
}
