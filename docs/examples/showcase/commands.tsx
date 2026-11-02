import { atom, useAtom } from 'jotai';
import { Card, CommandPalette, Text } from '@fastsprout/reacd';

const queryAtom = atom('');
const selectedAtom = atom('Choose a workspace action.');

export function CommandsCard() {
  const [query, setQuery] = useAtom(queryAtom);
  const [selected, setSelected] = useAtom(selectedAtom);
  return (
    <Card label="Quick actions">
      <Text role="subheadline">Quick actions</Text>
      <CommandPalette
        label="Find a workspace action"
        query={query}
        onQueryChange={setQuery}
        onSelect={(key) => setSelected(`Selected action: ${key}.`)}
        groups={[
          {
            key: 'workspace',
            label: 'Workspace',
            items: [
              { key: 'add-file', label: 'Add new file' },
              { key: 'add-folder', label: 'Add new folder' },
              { key: 'add-label', label: 'Add a label' },
            ],
          },
        ]}
      />
      <Text role="caption">{selected}</Text>
    </Card>
  );
}
