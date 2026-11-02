import { atom, useAtom } from 'jotai';
import { Button, Text, Toast, VStack } from '@fastsprout/reacd';

const openAtom = atom(false);
const restoredAtom = atom(false);

export function ToastExample() {
  const [open, setOpen] = useAtom(openAtom);
  const [restored, setRestored] = useAtom(restoredAtom);
  return (
    <VStack>
      <Button
        label="Save changes"
        onPress={() => {
          setRestored(false);
          setOpen(true);
        }}
      />
      <Toast
        title="Changes saved"
        description="Your project settings were updated."
        intent="success"
        open={open}
        onOpenChange={setOpen}
        action={{ label: 'Undo changes', onPress: () => setRestored(true) }}
      />
      <Text>{restored ? 'Changes restored.' : 'Project settings are ready.'}</Text>
    </VStack>
  );
}
