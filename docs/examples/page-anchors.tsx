import { PageAnchors, PageSection, Text, VStack } from 'reacd';

export function PageAnchorsExample() {
  return (
    <VStack>
      <PageAnchors
        label="Page anchor reference"
        activeKey="overview"
        links={[
          {
            key: 'overview',
            label: 'Read anchor target',
            href: '#anchor-reference-target',
          },
        ]}
      />
      <PageSection title="Anchor reference target" anchor="anchor-reference-target">
        <Text>
          Native links reach semantic headings without application DOM access.
        </Text>
      </PageSection>
    </VStack>
  );
}
