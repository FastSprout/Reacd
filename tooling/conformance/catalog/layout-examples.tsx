import { ViewBoundary } from '../loading/view-boundary.js';
import { CoreLayoutExamples } from './core-layout-examples.js';
import { atom, useAtom } from 'jotai';
import { AccordionExample } from '../fixtures/accordion.js';
import { CollapsibleExample } from '../fixtures/collapsible.js';
import { ShellExamples } from './shell-examples.js';
import { PageCompositionExamples } from './page-composition-examples.js';
import { PagePresentationExamples } from './page-presentation-examples.js';
import { PageNavigationExamples } from './page-navigation-examples.js';
import { SidebarSplitterExamples } from './sidebar-splitter-examples.js';
import { DashboardExamples } from './dashboard-examples.js';
import { EditorialExamples } from './editorial-examples.js';
import { PricingExamples } from './pricing-examples.js';
import { AuthMediaExamples } from './auth-media-examples.js';
import {
  Card,
  CodeBlock,
  Divider,
  Grid,
  HStack,
  Section,
  Spacer,
  SplitView,
  Text,
  Toggle,
  Toolbar,
  Viewport,
  VStack,
} from '@fastsprout/reacd';

const compactAtom = atom(false);
const SOURCE = '<Grid columns={3}>\n  <Card><Text>Content</Text></Card>\n</Grid>';

export function LayoutExamples() {
  const [compact, setCompact] = useAtom(compactAtom);
  return (
    <Section
      title="Layout primitives"
      description="Resize the preview. Container rules handle reflow."
    >
      <VStack>
        <Toolbar label="Layout preview">
          <Toggle
            label="Compact container"
            checked={compact}
            onCheckedChange={setCompact}
          />
          <ViewBoundary label="Spacer"><Spacer /></ViewBoundary>
        </Toolbar>
        <ViewBoundary label="Page composition examples">
          <PageCompositionExamples />
        </ViewBoundary>
        <ViewBoundary label="Page presentation examples">
          <PagePresentationExamples />
        </ViewBoundary>
        <ViewBoundary label="Page navigation examples">
          <PageNavigationExamples />
        </ViewBoundary>
        <ViewBoundary label="Sidebar and splitter examples">
          <SidebarSplitterExamples />
        </ViewBoundary>
        <ViewBoundary label="Dashboard examples">
          <DashboardExamples />
        </ViewBoundary>
        <ViewBoundary label="Editorial examples">
          <EditorialExamples />
        </ViewBoundary>
        <ViewBoundary label="Pricing examples">
          <PricingExamples />
        </ViewBoundary>
        <ViewBoundary label="Auth and media examples">
          <AuthMediaExamples />
        </ViewBoundary>
        <ViewBoundary label="Split view preview">
          <SplitView>
            <CodeBlock label="TSX declaration" content={SOURCE} />
            <Viewport compact={compact}>
              <VStack>
                <Grid columns={3}>
                  <Card>
                    <Text>First example</Text>
                  </Card>
                  <Card>
                    <Text>Second example</Text>
                  </Card>
                  <Card>
                    <Text>Third example</Text>
                  </Card>
                </Grid>
              </VStack>
            </Viewport>
          </SplitView>
        </ViewBoundary>
        <ViewBoundary label="Divider preview"><Divider /></ViewBoundary>
        <ViewBoundary label="Accordion example"><AccordionExample /></ViewBoundary>
        <ViewBoundary label="Collapsible example">
          <CollapsibleExample />
        </ViewBoundary>
        <ViewBoundary label="Application shell examples">
          <ShellExamples />
        </ViewBoundary>
        <ViewBoundary label="Long text flow">
          <HStack>
            <Text lineLimit={2}>
              {'Long content without spaces: ' +
                'component_containment_'.repeat(24)}
            </Text>
            <Text>Adjacent content stays in normal flow.</Text>
          </HStack>
        </ViewBoundary>
      </VStack>
      <CoreLayoutExamples />
    </Section>
  );
}
