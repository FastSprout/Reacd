import { atom, useAtom } from 'jotai';
import { ChangelogVersion, Text, Toggle, VStack } from '@fastsprout/reacd';

const indicatorAtom = atom(true);
const reviewedAtom = atom(false);

export function ChangelogVersionExample() {
  const [indicator, setIndicator] = useAtom(indicatorAtom);
  const [reviewed, setReviewed] = useAtom(reviewedAtom);
  return (
    <VStack>
      <Toggle
        label="Version indicator"
        checked={indicator}
        onCheckedChange={setIndicator}
      />
      <ChangelogVersion
        title="Review illustrative version"
        description="Example content, not an actual release announcement."
        date="2026-10-29"
        indicator={indicator}
        onPress={() => setReviewed(true)}
        badge={<Text>Example version</Text>}
        footer={
          <Text>{reviewed ? 'Version reviewed' : 'Version awaiting review'}</Text>
        }
      >
        <Text>Structured reacd content describes the example change.</Text>
      </ChangelogVersion>
    </VStack>
  );
}
