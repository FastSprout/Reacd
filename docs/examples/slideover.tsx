import { atom, useAtom } from 'jotai';
import {
  Slideover,
  Button,
  Input,
  Section,
  Select,
  Text,
  Toggle,
  VStack,
} from '@fastsprout/reacd';
const openAtom = atom(false);
const placementAtom = atom('end');
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
export function SlideoverExample() {
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
    <Section title="Slideover preview">
      <VStack>
        <Select
          label="Slideover placement"
          value={edge}
          items={EDGES}
          onValueChange={setEdge}
        />
        <Toggle
          label="Lock slideover dismissal"
          checked={locked}
          onCheckedChange={setLocked}
        />
        <Toggle label="Fullscreen slideover" checked={full} onCheckedChange={setFull} />
        <Slideover
          title="Sample slideover"
          description="Edit a note without losing application state."
          triggerLabel="Open sample slideover"
          open={open}
          onOpenChange={setOpen}
          placement={placement}
          dismissible={!locked}
          fullscreen={full}
          retainContent
          footer={<Button label="Save slideover note" onPress={() => setSaved(true)} />}
        >
          <Input label="Slideover note" value={note} onValueChange={setNote} />
          <Text>
            {saved
              ? 'Sample note saved locally.'
              : 'No persistence service is connected.'}
          </Text>
        </Slideover>
      </VStack>
    </Section>
  );
}
