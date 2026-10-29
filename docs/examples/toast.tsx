import { atom, useAtom } from 'jotai';
import { Button, Input, Section, Select, Text, Toast, Toggle, VStack } from 'reacd';
import type { ToastProps } from 'reacd';
const openAtom = atom(false);
const backgroundAtom = atom(false);
const titleAtom = atom('Sample record saved');
const heldAtom = atom(false);
const urgentAtom = atom(false);
const undoneAtom = atom(false);
const durationAtom = atom<NonNullable<ToastProps['duration']>>('persistent');
const DURATIONS = [
  { value: 'normal', label: 'Normal' },
  { value: 'long', label: 'Long' },
  { value: 'persistent', label: 'Persistent' },
];
export function ToastExample() {
  const [open, setOpen] = useAtom(openAtom);
  const [background, setBackground] = useAtom(backgroundAtom);
  const [title, setTitle] = useAtom(titleAtom);
  const [held, setHeld] = useAtom(heldAtom);
  const [urgent, setUrgent] = useAtom(urgentAtom);
  const [undone, setUndone] = useAtom(undoneAtom);
  const [duration, setDuration] = useAtom(durationAtom);
  return (
    <Section title="Toast preview">
      <VStack>
        <Input label="Notification title" value={title} onValueChange={setTitle} />
        <Select
          label="Notification duration"
          value={duration}
          items={DURATIONS}
          onValueChange={(value) =>
            setDuration(
              value === 'normal' ? 'normal' : value === 'long' ? 'long' : 'persistent',
            )
          }
        />
        <Toggle
          label="Keep notification open"
          checked={held}
          onCheckedChange={setHeld}
        />
        <Toggle
          label="Urgent notification"
          checked={urgent}
          onCheckedChange={setUrgent}
        />
        <Button label="Show notification" onPress={() => setOpen(true)} />
        <Button
          label="Show two notifications"
          onPress={() => {
            setOpen(true);
            setBackground(true);
          }}
        />
        <Toast
          title={title}
          description="The sample update is stored locally."
          intent="success"
          open={open}
          duration={duration}
          priority={urgent ? 'urgent' : 'normal'}
          onOpenChange={(next) => {
            if (held) return false;
            setOpen(next);
            return true;
          }}
          action={{ label: 'Undo sample update', onPress: () => setUndone(true) }}
        />
        <Toast
          title="Background export ready"
          description="The sample export is ready."
          open={background}
          onOpenChange={setBackground}
          duration="persistent"
        />
        <Text>{undone ? 'Sample update undone.' : 'No undo action performed.'}</Text>
        <Text>Use F6, then Tab to enter a notification; Escape dismisses it.</Text>
      </VStack>
    </Section>
  );
}
