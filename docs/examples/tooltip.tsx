import { atom, useAtom } from 'jotai';
import { Button, Text, Tooltip, VStack } from '@fastsprout/reacd';

const statusAtom = atom('Draft has unsaved changes.');

export function TooltipExample() {
  const [status, setStatus] = useAtom(statusAtom);

  return (
    <VStack>
      <Tooltip text="Save your changes without publishing.">
        <Button label="Save draft" onPress={() => setStatus('Draft saved.')} />
      </Tooltip>
      <Text>{status}</Text>
    </VStack>
  );
}
