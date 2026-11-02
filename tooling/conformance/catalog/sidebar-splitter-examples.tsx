import { Section, VStack } from '@fastsprout/reacd';
import { SidebarExample } from '../fixtures/sidebar.js';
import { SplitterExample } from '../fixtures/splitter.js';

export function SidebarSplitterExamples() {
  return (
    <Section
      title="Sidebar and Splitter"
      description="Controlled navigation and constrained percentage panel resizing."
    >
      <VStack>
        <SidebarExample />
        <SplitterExample />
      </VStack>
    </Section>
  );
}
