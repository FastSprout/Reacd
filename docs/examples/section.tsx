import { Section, Text } from '@fastsprout/reacd';

export function SectionExample() {
  return (
    <Section
      title="Release summary"
      anchor="release-summary"
      description="An anchored logical section."
    >
      <Text>The current release is ready.</Text>
    </Section>
  );
}
