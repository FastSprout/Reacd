import { Section, VStack } from 'reacd';
import { SidebarExample } from '../../docs/examples/sidebar.js';
import { SplitterExample } from '../../docs/examples/splitter.js';

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
