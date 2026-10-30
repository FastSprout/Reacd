import { atom, useAtom } from 'jotai';
import { z } from 'zod';
import {
  ContentSearch,
  ContentSearchButton,
  Select,
  Text,
  Toggle,
  VStack,
} from '@fastsprout/reacd';

const openAtom = atom(false);
const queryAtom = atom('');
const vetoAtom = atom(false);
const statusAtom = atom<'ready' | 'loading' | 'error'>('ready');
const resultAtom = atom('No documentation action yet.');
const statusSchema = z.enum(['ready', 'loading', 'error']);

export function ContentSearchExample() {
  const [open, setOpen] = useAtom(openAtom);
  const [query, setQuery] = useAtom(queryAtom);
  const [veto, setVeto] = useAtom(vetoAtom);
  const [status, setStatus] = useAtom(statusAtom);
  const [result, setResult] = useAtom(resultAtom);
  return (
    <VStack>
      <ContentSearchButton
        label="Open documentation search"
        open={open}
        onOpenChange={setOpen}
      />
      <ContentSearchButton
        label="Unavailable documentation search"
        open={open}
        onOpenChange={setOpen}
        disabled
      />
      <Text>{result}</Text>
      <ContentSearch
        title="Documentation search"
        label="Find documentation"
        description="Search the illustrative local reference catalog."
        open={open}
        onOpenChange={setOpen}
        query={query}
        onQueryChange={setQuery}
        status={status}
        onSelect={() => !veto}
        groups={[
          {
            key: 'guides',
            label: 'Reference guides',
            items: [
              {
                key: 'architecture',
                label: 'Inspect architecture reference',
                keywords: ['engine', 'layout'],
                onPress: () => setResult('Architecture reference inspected.'),
              },
              {
                key: 'unavailable',
                label: 'Unavailable reference',
                disabled: true,
              },
            ],
          },
        ]}
        footer={
          <VStack>
            <Toggle
              label="Veto documentation selection"
              checked={veto}
              onCheckedChange={setVeto}
            />
            <Select
              label="Documentation result status"
              value={status}
              onValueChange={(value) => setStatus(statusSchema.parse(value))}
              items={[
                { value: 'ready', label: 'Ready' },
                { value: 'loading', label: 'Loading' },
                { value: 'error', label: 'Error' },
              ]}
            />
          </VStack>
        }
      />
    </VStack>
  );
}
