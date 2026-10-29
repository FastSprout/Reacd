import { atom, useAtom } from 'jotai';
import { Header, Input, Select, Text, Link, VStack } from 'reacd';

const openAtom = atom(false);
const titleAtom = atom('reacd');
const modeAtom = atom<'modal' | 'slideover' | 'drawer'>('slideover');
const MODES = [
  { value: 'modal', label: 'Modal' },
  { value: 'slideover', label: 'Slideover' },
  { value: 'drawer', label: 'Drawer' },
];

export function HeaderExample() {
  const [open, setOpen] = useAtom(openAtom);
  const [title, setTitle] = useAtom(titleAtom);
  const [mode, setMode] = useAtom(modeAtom);
  return (
    <VStack>
      <Input label="Header title" value={title} onValueChange={setTitle} />
      <Select
        label="Header menu mode"
        value={mode}
        items={MODES}
        onValueChange={(value) =>
          setMode(
            value === 'modal' ? 'modal' : value === 'drawer' ? 'drawer' : 'slideover',
          )
        }
      />
      <Header
        title={title.trim() === '' ? 'reacd' : title}
        href="/"
        menu={{
          open,
          onOpenChange: setOpen,
          mode,
          content: <Link label="Component documentation" href="/components/" />,
        }}
      >
        <Text>Component reference</Text>
      </Header>
    </VStack>
  );
}
