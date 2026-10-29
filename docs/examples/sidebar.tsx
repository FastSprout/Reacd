import { atom, useAtom } from 'jotai';
import { App, Sidebar, Input, Text, VStack, Toggle, Select, Button } from 'reacd';

const desktopAtom = atom(true);
const mobileAtom = atom(false);
const queryAtom = atom('Workspace query');
const rtlAtom = atom(false);
const sideAtom = atom<'start' | 'end'>('start');
const variantAtom = atom<'sidebar' | 'floating' | 'inset'>('sidebar');
const policyAtom = atom<'offcanvas' | 'icon' | 'none'>('offcanvas');
const actionAtom = atom('No workspace action yet.');
const VARIANTS = ['sidebar', 'floating', 'inset'].map((value) => ({
  value,
  label: value,
}));
const POLICIES = ['offcanvas', 'icon', 'none'].map((value) => ({
  value,
  label: value,
}));

export function SidebarExample() {
  const [open, setOpen] = useAtom(desktopAtom);
  const [mobileOpen, setMobileOpen] = useAtom(mobileAtom);
  const [query, setQuery] = useAtom(queryAtom);
  const [rtl, setRtl] = useAtom(rtlAtom);
  const [side, setSide] = useAtom(sideAtom);
  const [variant, setVariant] = useAtom(variantAtom);
  const [collapsible, setCollapsible] = useAtom(policyAtom);
  const [action, setAction] = useAtom(actionAtom);
  return (
    <VStack>
      <Toggle label="Sidebar RTL" checked={rtl} onCheckedChange={setRtl} />
      <Toggle
        label="Sidebar end side"
        checked={side === 'end'}
        onCheckedChange={(checked) => setSide(checked ? 'end' : 'start')}
      />
      <Select
        label="Sidebar appearance"
        value={variant}
        items={VARIANTS}
        onValueChange={(value) =>
          setVariant(
            value === 'floating' ? 'floating' : value === 'inset' ? 'inset' : 'sidebar',
          )
        }
      />
      <Select
        label="Sidebar collapse policy"
        value={collapsible}
        items={POLICIES}
        onValueChange={(value) =>
          setCollapsible(
            value === 'icon' ? 'icon' : value === 'none' ? 'none' : 'offcanvas',
          )
        }
      />
      <App direction={rtl ? 'rtl' : 'ltr'}>
        <Sidebar title="Workspace navigation" description="Local preview navigation"
          open={open} onOpenChange={setOpen}
          mobileOpen={mobileOpen} onMobileOpenChange={setMobileOpen}
          side={side} variant={variant} collapsible={collapsible}
          header={<Text>Workspace controls</Text>}
          footer={<Text>Values survive collapse and responsive reflow.</Text>}
          actions={<Button label="Inspect workspace"
            onPress={() => setAction('Workspace inspected.')} />}
          collapsedContent={<Text>Workspace</Text>}>
          <Input
            label="Sidebar workspace query"
            value={query}
            onValueChange={setQuery}
          />
          <Text>{'Long_sidebar_label_'.repeat(16)}</Text>
        </Sidebar>
      </App>
      <Text>{action}</Text>
    </VStack>
  );
}
