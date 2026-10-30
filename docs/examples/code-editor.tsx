import { atom, useAtom } from 'jotai';
import { CodeEditor, Text, VStack } from '@fastsprout/reacd';

const sourceAtom = atom('Draft source');

export function CodeEditorExample() {
  const [source, setSource] = useAtom(sourceAtom);
  return (
    <VStack>
      <CodeEditor label="Editable source" value={source} onValueChange={setSource} />
      <Text>{`Current source: ${source}`}</Text>
    </VStack>
  );
}
