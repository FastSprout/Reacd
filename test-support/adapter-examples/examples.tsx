import { EDITOR_MENU_EXAMPLES } from './editor-menu-examples.js';
import { EDITOR_EXAMPLES } from '../adapter-editor-examples.js';
import { EDITOR_DRAG_HANDLE_EXAMPLES } from './editor-drag-handle-examples.js';
import { LOCALE_EXAMPLES } from './locale-examples.js';
import { COLOR_MODE_EXAMPLES } from './color-mode-examples.js';
import { CHART_EXAMPLES } from './chart-examples.js';
import { MARQUEE_EXAMPLES } from './marquee-examples.js';
import { CAROUSEL_EXAMPLES } from './carousel-examples.js';
import type { ReactNode } from 'react';
import { COLOR_PICKER_EXAMPLES } from './color-picker-examples.js';
import { FILE_UPLOAD_EXAMPLES } from './file-upload-examples.js';
import { InputMenu } from '../../src/components/input-menu/index.js';
import { CHAT_CATALOG_EXAMPLES } from './chat-catalog-examples.js';
import { FORM_CONTROL_EXAMPLES } from './form-control-examples.js';
import { CALENDAR_EXAMPLES } from './calendar-examples.js';
import { INPUT_TIME_EXAMPLES } from './input-time-examples.js';
import { INPUT_DATE_EXAMPLES } from './input-date-examples.js';
import { ELEMENT_EXAMPLES } from './element-examples.js';
import { FieldGroup } from '../../src/components/field-group/index.js';
import type { ComponentCatalog } from '../../src/components/catalog.js';
import { CATALOG_EXAMPLES } from './catalog-examples.js';
import {
  Container,
  Main,
  Header,
  Footer,
  Separator,
  User,
  ProgressGroup,
  Banner,
  InputNumber,
  PinInput,
  Alert,
  Pagination,
  Breadcrumb,
  Empty,
  Skeleton,
  Kbd,
  Popover,
  Chip,
  Tooltip,
  Avatar,
  AvatarGroup,
  RadioGroup,
  CheckboxGroup,
  Collapsible,
  Modal,
  Accordion,
  Badge,
  Button,
  Card,
  Checkbox,
  CodeBlock,
  CodeEditor,
  Divider,
  DataTable,
  Form,
  Grid,
  HStack,
  Input,
  Link,
  Navigation,
  Page,
  Progress,
  Section,
  Select,
  Slider,
  Spacer,
  Spinner,
  SplitView,
  SubmitButton,
  Table,
  Tabs,
  Text,
  TextArea,
  Toggle,
  Toolbar,
  Viewport,
  VStack,
} from '../../src/index.js';

export const OPTIONS = [
  { value: 'a', label: 'First' },
  { value: 'b', label: 'Second' },
];
const action = () => undefined;

export const EXAMPLES: Record<keyof ComponentCatalog, ReactNode> = {
  ...EDITOR_EXAMPLES,
  ...EDITOR_MENU_EXAMPLES,
  ...EDITOR_DRAG_HANDLE_EXAMPLES,
  ...COLOR_PICKER_EXAMPLES,
  ...FILE_UPLOAD_EXAMPLES,
  ...CAROUSEL_EXAMPLES,
  ...MARQUEE_EXAMPLES,
  ...CHART_EXAMPLES,
  ...COLOR_MODE_EXAMPLES,
  ...LOCALE_EXAMPLES,
  InputMenu: (
    <InputMenu label="Suggestion" value="" items={[]} onValueChange={action} />
  ),
  ...CHAT_CATALOG_EXAMPLES,
  ...FORM_CONTROL_EXAMPLES,
  ...CALENDAR_EXAMPLES,
  ...INPUT_TIME_EXAMPLES,
  ...INPUT_DATE_EXAMPLES,
  ...ELEMENT_EXAMPLES,
  FieldGroup: <FieldGroup label="Example controls">Grouped content</FieldGroup>,
  ...CATALOG_EXAMPLES,
  Container: (
    <Container>
      <Text>Contained content</Text>
    </Container>
  ),
  Main: (
    <Main>
      <Text>Main content</Text>
    </Main>
  ),
  Header: (
    <Header title="Application">
      <Text>Header content</Text>
    </Header>
  ),
  Footer: (
    <Footer>
      <Text>Footer content</Text>
    </Footer>
  ),
  Separator: <Separator />,
  User: <User name="Example Reader" />,
  ProgressGroup: (
    <ProgressGroup
      label="Example segments"
      items={[{ id: 'done', label: 'Complete', value: 20 }]}
    />
  ),
  Banner: <Banner title="Example notice" open onOpenChange={action} />,
  InputNumber: <InputNumber label="Quantity" value={1} onValueChange={action} />,
  PinInput: <PinInput label="Verification code" value="" onValueChange={action} />,
  Pagination: (
    <Pagination
      label="Example pages"
      totalItems={20}
      value={{ pageIndex: 0, pageSize: 10 }}
      onValueChange={action}
    />
  ),
  Breadcrumb: (
    <Breadcrumb label="Example path" items={[{ key: 'current', label: 'Current' }]} />
  ),
  Skeleton: <Skeleton label="Loading example" />,
  Empty: <Empty title="No example records" />,
  Kbd: <Kbd value="meta" />,
  Popover: (
    <Popover
      title="Example details"
      triggerLabel="Open example details"
      open={false}
      onOpenChange={action}
    >
      <Text>Details</Text>
    </Popover>
  ),
  Chip: (
    <Chip label="Online">
      <Text>Example identity</Text>
    </Chip>
  ),
  Tooltip: (
    <Tooltip text="Supplementary hint">
      <Text>Example anchor</Text>
    </Tooltip>
  ),
  Avatar: <Avatar name="Example Reader" />,
  AvatarGroup: (
    <AvatarGroup label="Example people" items={[{ id: 'a', name: 'Example Reader' }]} />
  ),
  RadioGroup: (
    <RadioGroup label="Choice" items={OPTIONS} value="a" onValueChange={action} />
  ),
  CheckboxGroup: (
    <CheckboxGroup label="Choices" items={OPTIONS} value={[]} onValueChange={action} />
  ),
  Collapsible: (
    <Collapsible label="Disclosure" open onOpenChange={action}>
      <Text>Disclosure content</Text>
    </Collapsible>
  ),
  Modal: (
    <Modal
      title="Modal example"
      description="Example dialog"
      open={false}
      triggerLabel="Open modal"
      onOpenChange={action}
    >
      <Text>Body</Text>
    </Modal>
  ),
  Accordion: (
    <Accordion
      label="Sections"
      value={[]}
      onValueChange={action}
      items={[{ value: 'one', label: 'One', content: <Text>Body</Text> }]}
    />
  ),
  VStack: (
    <VStack>
      <Text>Vertical content</Text>
    </VStack>
  ),
  HStack: (
    <HStack>
      <Text>Horizontal content</Text>
    </HStack>
  ),
  Grid: (
    <Grid columns={2}>
      <Text>Grid content</Text>
    </Grid>
  ),
  Card: (
    <Card>
      <Text>Card content</Text>
    </Card>
  ),
  Text: <Text>Text content</Text>,
  Button: <Button label="Action" onPress={action} />,
  SubmitButton: <SubmitButton label="Submit" />,
  Input: <Input label="Field" value="" onValueChange={action} />,
  TextArea: <TextArea label="Description" value="" onValueChange={action} />,
  Select: <Select label="Selection" value="a" items={OPTIONS} onValueChange={action} />,
  Checkbox: <Checkbox label="Consent" checked={false} onCheckedChange={action} />,
  Toggle: <Toggle label="Updates" checked={false} onCheckedChange={action} />,
  Slider: <Slider label="Volume" value={50} min={0} max={100} onValueChange={action} />,
  Form: (
    <Form label="Profile" onSubmit={action}>
      <Text>Form content</Text>
    </Form>
  ),
  Section: (
    <Section title="Section">
      <Text>Section content</Text>
    </Section>
  ),
  Page: (
    <Page title="Page">
      <Text>Page content</Text>
    </Page>
  ),
  Toolbar: (
    <Toolbar label="Actions">
      <Text>Toolbar content</Text>
    </Toolbar>
  ),
  Divider: <Divider />,
  Spacer: <Spacer />,
  SplitView: (
    <SplitView>
      <Text>Split content</Text>
    </SplitView>
  ),
  Viewport: (
    <Viewport compact>
      <Text>Viewport content</Text>
    </Viewport>
  ),
  Badge: <Badge label="Ready" />,
  Alert: <Alert title="Information" message="Details" intent="info" />,
  Progress: <Progress label="Completion" value={50} />,
  Spinner: <Spinner label="Loading example" />,
  Tabs: (
    <Tabs label="Views" value="a" items={OPTIONS} onValueChange={action}>
      <Text>Tab content</Text>
    </Tabs>
  ),
  Navigation: (
    <Navigation label="Routes" value="a" items={OPTIONS} onValueChange={action} />
  ),
  Link: <Link label="Docs" href="https://reacd.dev/" />,
  CodeBlock: <CodeBlock label="Example code" content="const value = 1;" />,
  CodeEditor: <CodeEditor label="Source" value="{}" onValueChange={action} />,
  Table: <Table caption="Inventory" columns={['Name']} rows={[['Example']]} />,
  DataTable: (
    <DataTable
      caption="Records"
      columns={[{ key: 'name', label: 'Name', kind: 'text' }]}
      rows={[{ id: 'a', cells: { name: 'Example' } }]}
      selection={[]}
      sorting={[]}
      filters={[]}
      pagination={{ pageIndex: 0, pageSize: 25 }}
      totalRows={1}
      filteredRows={1}
      pageCount={1}
    />
  ),
};
