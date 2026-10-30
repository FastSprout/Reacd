import { PageFeature, PageSection, Text } from '@fastsprout/reacd';

export function PageSectionExample() {
  return (
    <PageSection
      title="PageSection composition"
      headline="Section reference"
      description="Features remain ordinary closed components."
      leading={<Text weight="bold">Related concepts</Text>}
      features={
        <PageFeature
          title="Read layout reference"
          href="/"
          description="Nested headings follow their containing section."
        />
      }
      header={<Text>Section header slot</Text>}
      footer={<Text>Section footer slot</Text>}
      top={<Text>Section top slot</Text>}
      bottom={<Text>Section bottom slot</Text>}
    >
      <Text>Section body content remains reachable at narrow widths.</Text>
    </PageSection>
  );
}
