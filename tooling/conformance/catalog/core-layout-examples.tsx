import { VStack } from '@fastsprout/reacd';
import { CodeBlockExample } from '../../../docs/examples/code-block.js';
import { DividerExample } from '../../../docs/examples/divider.js';
import { GridExample } from '../../../docs/examples/grid.js';
import { HStackExample } from '../../../docs/examples/h-stack.js';
import { SectionExample } from '../../../docs/examples/section.js';
import { SpacerExample } from '../../../docs/examples/spacer.js';
import { SplitViewExample } from '../../../docs/examples/split-view.js';
import { TextExample } from '../../../docs/examples/text.js';
import { ToolbarExample } from '../../../docs/examples/toolbar.js';
import { VStackExample } from '../../../docs/examples/v-stack.js';
import { ViewportExample } from '../../../docs/examples/viewport.js';

export function CoreLayoutExamples() {
  return (
    <VStack>
      <CodeBlockExample />
      <DividerExample />
      <GridExample />
      <HStackExample />
      <SectionExample />
      <SpacerExample />
      <SplitViewExample />
      <TextExample />
      <ToolbarExample />
      <VStackExample />
      <ViewportExample />
    </VStack>
  );
}
