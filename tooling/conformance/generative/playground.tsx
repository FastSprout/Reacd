import { browserAdapter } from '../../../test-support/browser/adapter.js';
import { atom, useAtom } from 'jotai';
import { atomWithLazy } from 'jotai/vanilla/utils';
import {
  Alert,
  Button,
  Card,
  CodeEditor,
  HStack,
  Section,
  SplitView,
  Text,
  VStack,
} from '@fastsprout/reacd';
import {
  createDocumentState,
  GenerativeUI,
  parseGenerativeJson,
} from '@fastsprout/reacd/generative';
import { GENERATIVE_EXAMPLE, GENERATIVE_SOURCE } from './example.js';

const sourceAtom = atom(GENERATIVE_SOURCE);
const runtimeAtom = atomWithLazy(() => ({
  declaration: GENERATIVE_EXAMPLE,
  registry: createDocumentState(GENERATIVE_EXAMPLE),
}));
const errorAtom = atom('');
const actionAtom = atom('No action received yet.');

export function GenerativePlayground() {
  const [source, setSource] = useAtom(sourceAtom);
  const [runtime, setRuntime] = useAtom(runtimeAtom);
  const [error, setError] = useAtom(errorAtom);
  const [action, setAction] = useAtom(actionAtom);
  function apply() {
    const result = parseGenerativeJson(source);
    if (result.success) {
      const candidate = createDocumentState(result.data);
      const sameShape =
        candidate.definitionSignature === runtime.registry.definitionSignature;
      setRuntime({
        declaration: result.data,
        registry: sameShape ? runtime.registry : candidate,
      });
      setError('');
    } else {
      setError(
        result.issues.map((issue) => `${issue.path}: ${issue.message}`).join('\n'),
      );
    }
  }
  function reset() {
    setSource(GENERATIVE_SOURCE);
    setRuntime({
      declaration: GENERATIVE_EXAMPLE,
      registry: createDocumentState(GENERATIVE_EXAMPLE),
    });
    setError('');
    setAction('No action received yet.');
  }
  return (
    <Section
      title="Generative UI"
      description="Typed state keys connect readers and writers through Jotai."
    >
      <SplitView>
        <Card>
          <CodeEditor
            label="JSON declaration"
            value={source}
            onValueChange={setSource}
          />
          <HStack>
            <Button label="Render declaration" onPress={apply} />
            <Button label="Reset declaration" intent="secondary" onPress={reset} />
          </HStack>
          {error !== '' && (
            <Alert title="Invalid declaration" intent="error" message={error} />
          )}
        </Card>
        <VStack>
          <GenerativeUI
            adapter={browserAdapter}
            document={runtime.declaration}
            registry={runtime.registry}
            actions={{
              saveExample: ({ state }) => {
                const note = state.read('note');
                setAction(
                  `Saved locally: ${
                    note.success && note.data.kind === 'text' ? note.data.value : ''
                  }`,
                );
              },
            }}
          />
          <Text role="caption">{action}</Text>
        </VStack>
      </SplitView>
    </Section>
  );
}
