import { atom, useAtom } from 'jotai';
import { ChangelogVersion, ChangelogVersions, Text, Toggle, VStack } from 'reacd';

const indicatorsAtom = atom(false);

export function ChangelogVersionsExample() {
  const [indicators, setIndicators] = useAtom(indicatorsAtom);
  return (
    <VStack>
      <Toggle
        label="Collection version indicators"
        checked={indicators}
        onCheckedChange={setIndicators}
      />
      <ChangelogVersions
        indicator={indicators}
        versions={[
          { key: 'example', title: 'Illustrative version record', date: '2026-10-29' },
        ]}
      >
        <ChangelogVersion title="Supplemental version record" indicator>
          <Text>
            Its explicit indicator remains independent of the collection default.
          </Text>
        </ChangelogVersion>
      </ChangelogVersions>
    </VStack>
  );
}
