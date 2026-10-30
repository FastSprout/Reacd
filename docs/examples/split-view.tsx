import { Section, SplitView, Text } from '@fastsprout/reacd';

export function SplitViewExample() {
  return (
    <SplitView>
      <Section title="Project summary">
        <Text>Current project status.</Text>
      </Section>
      <Section title="Project details">
        <Text>Project context and notes.</Text>
      </Section>
    </SplitView>
  );
}
