import { DeferredView } from '../loading/deferred-view.js';
import { DataTableExample } from '../../../docs/examples/data-table.js';
import { EditorExamples } from './editor-examples.js';
import { TableExample } from '../../../docs/examples/table.js';
import { ChartExample } from '../fixtures/chart.js';
import { MarqueeExample } from '../../../docs/examples/marquee.js';
import { CarouselExample } from '../../../docs/examples/carousel.js';
import { atom, useAtom } from 'jotai';
import { ChatComposerExamples } from './chat-composer-examples.js';
import { ChatExamples } from './chat-examples.js';
import { ChatFeedbackExamples } from './chat-feedback-examples.js';
import { AvatarExample } from '../fixtures/avatar.js';
import { AvatarGroupExample } from '../fixtures/avatar-group.js';
import { ChipExample } from '../../../docs/examples/chip.js';
import { TooltipExample } from '../fixtures/tooltip.js';
import { KbdExample } from '../../../docs/examples/kbd.js';
import { PopoverExample } from '../../../docs/examples/popover.js';
import { SkeletonExample } from '../../../docs/examples/skeleton.js';
import { EmptyExample } from '../../../docs/examples/empty.js';
import { UserExample } from '../../../docs/examples/user.js';
import { ProgressGroupExample } from '../../../docs/examples/progress-group.js';
import { TimelineExample } from '../../../docs/examples/timeline.js';
import { ScrollAreaExample } from '../../../docs/examples/scroll-area.js';
import { Section, Select, Table, Text, VStack } from '@fastsprout/reacd';
import type { TableProps } from '@fastsprout/reacd';

const stateAtom = atom('ready');
const STATES = [
  { value: 'ready', label: 'Ready' },
  { value: 'empty', label: 'Empty' },
  { value: 'loading', label: 'Loading' },
  { value: 'error', label: 'Error' },
];
const ROWS = [
  ['Example entry', 'Ready'],
  ['Another example', 'Pending'],
];

export function DataExamples() {
  const [state, setState] = useAtom(stateAtom);
  const tableState: TableProps['state'] =
    state === 'loading' ? 'loading' : state === 'error' ? 'error' : 'ready';
  return (
    <Section
      title="Content and data"
      description="Each data state has an accessible representation."
    >
      <VStack>
        <Text weight="bold">Text is content, even when it contains markup.</Text>
        <Text>{'<script>This is displayed as text.</script>'}</Text>
        <Select
          label="Data state"
          value={state}
          items={STATES}
          onValueChange={setState}
        />
        <Table
          caption="Example inventory"
          columns={['Name', 'Status']}
          rows={state === 'empty' ? [] : ROWS}
          state={tableState}
          errorMessage="Example failure. Choose Ready to restore the table."
        />
        <DeferredView label="Avatar">
          <AvatarExample />
        </DeferredView>
        <DeferredView label="AvatarGroup">
          <AvatarGroupExample />
        </DeferredView>
        <DeferredView label="Chip">
          <ChipExample />
        </DeferredView>
        <DeferredView label="Tooltip">
          <TooltipExample />
        </DeferredView>
        <DeferredView label="Kbd">
          <KbdExample />
        </DeferredView>
        <DeferredView label="Popover">
          <PopoverExample />
        </DeferredView>
        <DeferredView label="Skeleton">
          <SkeletonExample />
        </DeferredView>
        <DeferredView label="Empty">
          <EmptyExample />
        </DeferredView>
        <DeferredView label="User">
          <UserExample />
        </DeferredView>
        <DeferredView label="ProgressGroup">
          <ProgressGroupExample />
        </DeferredView>
        <DeferredView label="Timeline">
          <TimelineExample />
        </DeferredView>
        <DeferredView label="ScrollArea">
          <ScrollAreaExample />
        </DeferredView>
        <DeferredView label="Tree">
          <TreeExample />
        </DeferredView>
        <DeferredView label="Carousel">
          <CarouselExample />
        </DeferredView>
        <DeferredView label="Marquee">
          <MarqueeExample />
        </DeferredView>
        <DeferredView label="Chart">
          <ChartExample />
        </DeferredView>
        <DeferredView label="Table">
          <TableExample />
        </DeferredView>
        <DeferredView label="Chat">
          <ChatExamples />
        </DeferredView>
        <DeferredView label="ChatFeedback">
          <ChatFeedbackExamples />
        </DeferredView>
        <DeferredView label="ChatComposer">
          <ChatComposerExamples />
        </DeferredView>
        <DeferredView label="Editor">
          <EditorExamples />
        </DeferredView>
      </VStack>
      <DeferredView label="DataTable">
        <DataTableExample />
      </DeferredView>
    </Section>
  );
}
import { TreeExample } from '../../../docs/examples/tree.js';
