import { atom, useAtom } from 'jotai';
import {
  Button,
  Card,
  DashboardGroup,
  DashboardNavbar,
  DashboardPanel,
  DashboardSearch,
  DashboardSearchButton,
  DashboardSidebar,
  DashboardSidebarCollapse,
  DashboardSidebarToggle,
  DashboardToolbar,
  Grid,
  Input,
  Navigation,
  Table,
  Text,
  VStack,
} from '@fastsprout/reacd';
import type { DashboardGroupProps } from '@fastsprout/reacd';

const WORKSPACE_LAYOUT = [
  { id: 'navigation', share: 25 },
  { id: 'workspace', share: 75 },
];
const SECTIONS = ['Overview', 'Orders'].map((value) => ({ value, label: value }));
const RECENT_ORDERS = [
  ['ORD-1042', 'Ada Chen', 'Processing'],
  ['ORD-1041', 'Mina Patel', 'Delivered'],
  ['ORD-1040', 'Lin Martin', 'Processing'],
];
const layoutAtom = atom<DashboardGroupProps['value']>(WORKSPACE_LAYOUT);
const openAtom = atom(true);
const mobileAtom = atom(false);
const sectionAtom = atom('Overview');
const noteAtom = atom('Review this week’s orders.');
const searchOpenAtom = atom(false);
const queryAtom = atom('');
const messageAtom = atom('Sample data. Changes stay in this preview.');

export function DashboardExample() {
  const [layout, setLayout] = useAtom(layoutAtom);
  const [open, setOpen] = useAtom(openAtom);
  const [mobile, setMobile] = useAtom(mobileAtom);
  const [section, setSection] = useAtom(sectionAtom);
  const [note, setNote] = useAtom(noteAtom);
  const [searchOpen, setSearchOpen] = useAtom(searchOpenAtom);
  const [query, setQuery] = useAtom(queryAtom);
  const [message, setMessage] = useAtom(messageAtom);
  const openSearch = () => setSearchOpen(true);
  const createDraft = () => setMessage('Draft order created in this preview.');
  return (
    <DashboardGroup
      label="Orders workspace"
      value={layout}
      onValueChange={setLayout}
      open={open}
      onOpenChange={setOpen}
      mobileOpen={mobile}
      onMobileOpenChange={setMobile}
      collapseMode="icon"
      regions={[
        {
          id: 'navigation',
          label: 'Workspace navigation',
          kind: 'sidebar',
          content: (
            <DashboardSidebar
              description="Acme workspace"
              header={<DashboardSearchButton onPress={openSearch} />}
              collapsedContent={<DashboardSidebarCollapse label="Expand workspace" />}
            >
              <Navigation
                label="Workspace sections"
                items={SECTIONS}
                value={section}
                onValueChange={setSection}
              />
              <Input label="Workspace note" value={note} onValueChange={setNote} />
            </DashboardSidebar>
          ),
        },
        {
          id: 'workspace',
          label: 'Order management',
          kind: 'panel',
          content: (
            <DashboardPanel
              header={
                <DashboardNavbar
                  title={section}
                  leading={<DashboardSidebarCollapse />}
                  end={<Button label="Create draft order" onPress={createDraft} />}
                />
              }
              footer={
                <DashboardToolbar label="Workspace actions">
                  <DashboardSidebarToggle label="Open workspace navigation" />
                  <Text>{message}</Text>
                </DashboardToolbar>
              }
            >
              <VStack>
                {section === 'Overview' && (
                  <Grid columns={2}>
                    <Card>
                      <Text role="caption">Recent orders</Text>
                      <Text role="subheadline">3 orders</Text>
                    </Card>
                    <Card>
                      <Text role="caption">Awaiting delivery</Text>
                      <Text role="subheadline">2 orders</Text>
                    </Card>
                  </Grid>
                )}
                <Table
                  caption="Recent orders"
                  columns={['Order', 'Customer', 'Status']}
                  rows={RECENT_ORDERS}
                />
              </VStack>
            </DashboardPanel>
          ),
        },
      ]}
    >
      <DashboardSearch
        title="Workspace search"
        label="Search workspace"
        open={searchOpen}
        onOpenChange={setSearchOpen}
        query={query}
        onQueryChange={setQuery}
        groups={[
          {
            key: 'workspace',
            label: 'Workspace',
            items: [
              {
                key: 'orders',
                label: 'View orders',
                onPress: () => setSection('Orders'),
              },
              { key: 'draft', label: 'Create draft order', onPress: createDraft },
            ],
          },
        ]}
      />
    </DashboardGroup>
  );
}
