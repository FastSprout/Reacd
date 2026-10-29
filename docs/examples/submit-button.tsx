import { atom, useAtom } from 'jotai';
import { Form, SubmitButton, Text } from 'reacd';

const approvalsAtom = atom(0);

export function SubmitButtonExample() {
  const [approvals, setApprovals] = useAtom(approvalsAtom);
  return (
    <Form label="Sample approval" onSubmit={() => setApprovals((count) => count + 1)}>
      <SubmitButton label="Approve sample" />
      <Text>{`Approved samples: ${approvals}`}</Text>
    </Form>
  );
}
