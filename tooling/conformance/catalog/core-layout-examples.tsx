import { VStack } from '@fastsprout/reacd';
import { CodeBlockExample } from '../../../docs/examples/code-block.js';
import { DividerExample } from '../../../docs/examples/divider.js';
import { GridExample } from '../fixtures/grid.js';
import { HStackExample } from '../../../docs/examples/h-stack.js';
import { SectionExample } from '../../../docs/examples/section.js';
import { SpacerExample } from '../../../docs/examples/spacer.js';
import { SplitViewExample } from '../../../docs/examples/split-view.js';
import { TextExample } from '../../../docs/examples/text.js';
import { ToolbarExample } from '../../../docs/examples/toolbar.js';
import { VStackExample } from '../../../docs/examples/v-stack.js';
import { ViewportExample } from '../../../docs/examples/viewport.js';
import { ViewBoundary } from '../loading/view-boundary.js';

export function CoreLayoutExamples() {
  return (
    <VStack>
      <ViewBoundary label="CodeBlock example"><CodeBlockExample /></ViewBoundary>
      <ViewBoundary label="Divider example"><DividerExample /></ViewBoundary>
      <ViewBoundary label="Grid example"><GridExample /></ViewBoundary>
      <ViewBoundary label="HStack example"><HStackExample /></ViewBoundary>
      <ViewBoundary label="Section example"><SectionExample /></ViewBoundary>
      <ViewBoundary label="Spacer example"><SpacerExample /></ViewBoundary>
      <ViewBoundary label="SplitView example"><SplitViewExample /></ViewBoundary>
      <ViewBoundary label="Text example"><TextExample /></ViewBoundary>
      <ViewBoundary label="Toolbar example"><ToolbarExample /></ViewBoundary>
      <ViewBoundary label="VStack example"><VStackExample /></ViewBoundary>
      <ViewBoundary label="Viewport example"><ViewportExample /></ViewBoundary>
    </VStack>
  );
}
