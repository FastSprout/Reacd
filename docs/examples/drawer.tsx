import { atom, useAtom } from 'jotai';
import {
  Drawer,
  Button,
  Input,
  Section,
  Select,
  Text,
  Toggle,
  VStack,
} from '@fastsprout/reacd';
const openAtom = atom(false);
const placementAtom = atom('bottom');
const noteAtom = atom('Sample note');
const lockedAtom = atom(false);
const fullAtom = atom(false);
const savedAtom = atom(false);
const EDGES = [
  { value: 'top', label: 'Top' },
  { value: 'bottom', label: 'Bottom' },
  { value: 'start', label: 'Start' },
  { value: 'end', label: 'End' },
];
export function DrawerExample() {
  const [open, setOpen] = useAtom(openAtom);
  const [edge, setEdge] = useAtom(placementAtom);
  const [note, setNote] = useAtom(noteAtom);
  const [locked, setLocked] = useAtom(lockedAtom);
  const [full, setFull] = useAtom(fullAtom);
  const [saved, setSaved] = useAtom(savedAtom);
  const placement =
    edge === 'top'
      ? 'top'
      : edge === 'bottom'
        ? 'bottom'
        : edge === 'start'
          ? 'start'
          : 'end';
  return (
    <Section title="Drawer preview">
      <VStack>
        <Select
          label="Drawer placement"
          value={edge}
          items={EDGES}
          onValueChange={setEdge}
        />
        <Toggle
          label="Lock drawer dismissal"
          checked={locked}
          onCheckedChange={setLocked}
        />
        <Toggle label="Fullscreen drawer" checked={full} onCheckedChange={setFull} />
        <Drawer
          title="Sample drawer"
          description="Edit a note without losing application state."
          triggerLabel="Open sample drawer"
          open={open}
          onOpenChange={setOpen}
          placement={placement}
          dismissible={!locked}
          fullscreen={full}
          retainContent
          footer={<Button label="Save drawer note" onPress={() => setSaved(true)} />}
        >
          <Input label="Drawer note" value={note} onValueChange={setNote} />
          <Text>
            {saved
              ? 'Sample note saved locally.'
              : 'No persistence service is connected.'}
          </Text>
        </Drawer>
      </VStack>
    </Section>
  );
}
