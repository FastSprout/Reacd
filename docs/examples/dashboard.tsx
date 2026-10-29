import { atom, useAtom } from 'jotai';
import {
  App,
  Button,
  DashboardGroup,
  DashboardSidebar,
  DashboardPanel,
  DashboardNavbar,
  DashboardToolbar,
  DashboardSidebarCollapse,
  DashboardSidebarToggle,
  DashboardResizeHandle,
  DashboardSearch,
  DashboardSearchButton,
  Input,
  Select,
  Text,
  Toggle,
  VStack,
} from 'reacd';
import type { DashboardGroupProps } from 'reacd';

const INITIAL = [
  { id: 'navigation', share: 25 },
  { id: 'inbox', share: 75 },
];
const MULTIPLE = [
  { id: 'navigation', share: 25 },
  { id: 'inbox', share: 50 },
  { id: 'notes', share: 25 },
];
const layoutAtom = atom<DashboardGroupProps['value']>(INITIAL);
const openAtom = atom(true);
const mobileAtom = atom(false);
const rtlAtom = atom(false);
const iconAtom = atom(false);
const disabledAtom = atom(false);
const extraAtom = atom(false);
const rejectAtom = atom(false);
const draftAtom = atom('Retained dashboard draft');
const searchOpenAtom = atom(false);
const queryAtom = atom('');
const selectedAtom = atom('No command selected.');
const messageAtom = atom('No workspace action yet.');
const statusAtom = atom<'ready' | 'loading' | 'error'>('ready');
const STATUS_ITEMS = ['ready', 'loading', 'error'].map((value) => ({
  value,
  label: value,
}));

export function DashboardExample() {
  const [layout, setLayout] = useAtom(layoutAtom);
  const [open, setOpen] = useAtom(openAtom);
  const [mobile, setMobile] = useAtom(mobileAtom);
  const [rtl, setRtl] = useAtom(rtlAtom);
  const [icon, setIcon] = useAtom(iconAtom);
  const [disabled, setDisabled] = useAtom(disabledAtom);
  const [extra, setExtra] = useAtom(extraAtom);
  const [reject, setReject] = useAtom(rejectAtom);
  const [draft, setDraft] = useAtom(draftAtom);
  const [searchOpen, setSearchOpen] = useAtom(searchOpenAtom);
  const [query, setQuery] = useAtom(queryAtom);
  const [selected, setSelected] = useAtom(selectedAtom);
  const [message, setMessage] = useAtom(messageAtom);
  const [status, setStatus] = useAtom(statusAtom);
  const inspectInbox = () => setMessage('Inbox inspected.');
  const inspectNotes = () => setMessage('Notes inspected.');
  const regions: DashboardGroupProps['regions'] = [
    {
      id: 'navigation',
      label: 'Dashboard navigation',
      kind: 'sidebar',
      minShare: 15,
      maxShare: 40,
      content: (
        <DashboardSidebar
          description="Local dashboard fixture"
          header={<DashboardSearchButton onPress={() => setSearchOpen(true)} />}
          footer={<DashboardResizeHandle label="Additional navigation resize" />}
          collapsedContent={<DashboardSidebarCollapse label="Expand workspace" />}
        >
          <Input
            label="Dashboard navigation draft"
            value={draft}
            onValueChange={setDraft}
          />
          <Text>{'Long_dashboard_navigation_'.repeat(12)}</Text>
        </DashboardSidebar>
      ),
    },
    {
      id: 'inbox',
      label: 'Dashboard inbox',
      kind: 'panel',
      content: (
        <DashboardPanel
          header={
            <DashboardNavbar
              leading={<DashboardSidebarCollapse />}
              trailing={<Text role="caption">{selected}</Text>}
              end={
                <Button label="Clear dashboard draft" onPress={() => setDraft('')} />
              }
            >
              <Text>Local workspace</Text>
            </DashboardNavbar>
          }
          footer={
            <DashboardToolbar
              label="Dashboard actions"
              start={<DashboardSidebarToggle label="Open workspace navigation" />}
              end={
                <DashboardSearchButton
                  label="Find workspace command"
                  onPress={() => setSearchOpen(true)}
                />
              }
            >
              <Button label="Inspect dashboard inbox" onPress={inspectInbox} />
            </DashboardToolbar>
          }
        >
          <Text>{message}</Text>
          <Text>
            Panel constraints and reflow belong to the engine. This is fixture data.
          </Text>
        </DashboardPanel>
      ),
    },
    ...(extra
      ? [
          {
            id: 'notes',
            label: 'Dashboard notes',
            kind: 'panel' as const,
            content: (
              <DashboardPanel header={<DashboardNavbar title="Workspace notes" />}>
                <Button label="Inspect dashboard notes" onPress={inspectNotes} />
                <Text>{'Long_dashboard_notes_'.repeat(12)}</Text>
              </DashboardPanel>
            ),
          },
        ]
      : []),
  ];
  return (
    <VStack>
      <Toggle label="Dashboard RTL" checked={rtl} onCheckedChange={setRtl} />
      <Toggle
        label="Dashboard icon collapse"
        checked={icon}
        onCheckedChange={setIcon}
      />
      <Toggle
        label="Disable dashboard resizing"
        checked={disabled}
        onCheckedChange={setDisabled}
      />
      <Toggle
        label="Additional dashboard panel"
        checked={extra}
        onCheckedChange={(next) => {
          setExtra(next);
          setLayout(next ? MULTIPLE : INITIAL);
        }}
      />
      <Toggle
        label="Reject dashboard selection"
        checked={reject}
        onCheckedChange={setReject}
      />
      <Select
        label="Dashboard command status"
        value={status}
        items={STATUS_ITEMS}
        onValueChange={(value) =>
          setStatus(
            value === 'loading' ? 'loading' : value === 'error' ? 'error' : 'ready',
          )
        }
      />
      <App direction={rtl ? 'rtl' : 'ltr'}>
        <DashboardGroup
          label="Dashboard workspace"
          regions={regions}
          value={layout}
          onValueChange={setLayout}
          open={open}
          onOpenChange={setOpen}
          mobileOpen={mobile}
          onMobileOpenChange={setMobile}
          disabled={disabled}
          collapseMode={icon ? 'icon' : 'offcanvas'}
        >
          <DashboardSearch
            title="Workspace commands"
            label="Find dashboard commands"
            description="Commands for this local dashboard fixture."
            open={searchOpen}
            onOpenChange={setSearchOpen}
            query={query}
            onQueryChange={setQuery}
            status={status}
            errorMessage="Dashboard commands unavailable."
            groups={[
              {
                key: 'workspace',
                label: 'Workspace',
                items: [
                  {
                    key: 'inspect-inbox',
                    label: 'Inspect inbox',
                    keywords: ['review'],
                    onPress: inspectInbox,
                  },
                  {
                    key: 'inspect-notes',
                    label: 'Inspect notes',
                    keywords: ['memo'],
                    onPress: inspectNotes,
                  },
                ],
              },
            ]}
            onSelect={(key) => {
              if (reject) return false;
              setSelected(key);
              return true;
            }}
          />
        </DashboardGroup>
      </App>
      {layout.map((panel) => (
        <Text key={panel.id}>{`${panel.id} expanded share: ${panel.share}`}</Text>
      ))}
    </VStack>
  );
}
