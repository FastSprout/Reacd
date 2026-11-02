import { atom, useAtom } from 'jotai';
import { Tree } from '@fastsprout/reacd';

const selectedAtom = atom<readonly string[]>([]);
const expandedAtom = atom<readonly string[]>([]);
const documents = [
  {
    id: 'documents',
    label: 'Documents',
    children: [
      { id: 'brief', label: 'Project brief' },
      { id: 'schedule', label: 'Schedule' },
    ],
  },
  { id: 'notes', label: 'Meeting notes' },
];

export function TreeExample() {
  const [selected, setSelected] = useAtom(selectedAtom);
  const [expanded, setExpanded] = useAtom(expandedAtom);

  return (
    <Tree
      label="Project documents"
      items={documents}
      value={selected}
      onValueChange={setSelected}
      expanded={expanded}
      onExpandedChange={setExpanded}
    />
  );
}
