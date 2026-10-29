import { atom, useAtom } from 'jotai';
import { CommandPalette, Section, Select, Text, Toggle, VStack } from 'reacd';

const queryAtom = atom('');
const statusAtom = atom('ready');
const externalAtom = atom(false);
const blockAtom = atom(false);
const selectedAtom = atom('No command selected.');
const messageAtom = atom('Command actions run locally.');
const STATES = [
  { value: 'ready', label: 'Ready' },
  { value: 'loading', label: 'Loading' },
  { value: 'error', label: 'Error' },
];

export function CommandPaletteExample() {
  const [query, setQuery] = useAtom(queryAtom);
  const [status, setStatus] = useAtom(statusAtom);
  const [external, setExternal] = useAtom(externalAtom);
  const [block, setBlock] = useAtom(blockAtom);
  const [selected, setSelected] = useAtom(selectedAtom);
  const [message, setMessage] = useAtom(messageAtom);
  return (
    <Section title="Command palette preview">
      <VStack>
        <Select
          label="Command result status"
          value={status}
          items={STATES}
          onValueChange={setStatus}
        />
        <Toggle
          label="Host-filtered command results"
          checked={external}
          onCheckedChange={setExternal}
        />
        <Toggle
          label="Veto command activation"
          checked={block}
          onCheckedChange={setBlock}
        />
        <CommandPalette
          label="Sample command search"
          query={query}
          onQueryChange={setQuery}
          filtering={external ? 'external' : 'local'}
          status={
            status === 'loading' ? 'loading' : status === 'error' ? 'error' : 'ready'
          }
          onSelect={(key) => {
            if (block) return false;
            setSelected(`Selected command: ${key}`);
            return true;
          }}
          groups={[
            {
              key: 'workspace',
              label: 'Workspace commands',
              items: [
                {
                  key: 'profile',
                  label: 'Open profile locally',
                  keywords: ['account'],
                  description: 'A local action that retains the workbench page.',
                  onPress: () => setMessage('Profile opened locally.'),
                },
                {
                  key: 'disabled',
                  label: 'Unavailable command',
                  disabled: true,
                  href: '/',
                },
              ],
            },
            {
              key: 'resources',
              label: 'Resource commands',
              items: [
                {
                  key: 'docs',
                  label: 'Inspect documentation locally',
                  onPress: () => setMessage('Documentation inspected locally.'),
                },
              ],
            },
          ]}
        />
        <Text>{selected}</Text>
        <Text>{message}</Text>
      </VStack>
    </Section>
  );
}
