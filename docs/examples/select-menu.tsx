import { atom, useAtom } from 'jotai';
import { SelectMenu } from '@fastsprout/reacd';

const assigneeAtom = atom('maya');
const assignees = [
  { value: 'maya', label: 'Maya Patel' },
  { value: 'leo', label: 'Leo Martin' },
  { value: 'nora', label: 'Nora Chen — Customer operations and regional support' },
];

export function SelectMenuExample() {
  const [assignee, setAssignee] = useAtom(assigneeAtom);

  return (
    <SelectMenu
      label="Assignee"
      items={assignees}
      value={assignee}
      onValueChange={setAssignee}
    />
  );
}
