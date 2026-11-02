import { atom, useAtom } from 'jotai';
import { Card, Form, Input, SubmitButton, Text, Textarea } from '@fastsprout/reacd';

const titleAtom = atom('');
const detailsAtom = atom('');
const statusAtom = atom('This report stays in your browser.');

export function BugReportCard() {
  const [title, setTitle] = useAtom(titleAtom);
  const [details, setDetails] = useAtom(detailsAtom);
  const [status, setStatus] = useAtom(statusAtom);
  return (
    <Card label="Report a bug">
      <Text role="subheadline">Report a bug</Text>
      <Text role="caption">Help us understand the issue.</Text>
      <Form
        label="Sample bug report"
        onSubmit={() => setStatus(`Draft prepared: ${title}.`)}
      >
        <Input
          label="Issue title"
          value={title}
          required
          placeholder="Brief description of the issue"
          onValueChange={setTitle}
        />
        <Textarea
          label="Issue details"
          value={details}
          placeholder="What happened?"
          onValueChange={setDetails}
        />
        <SubmitButton label="Prepare report" />
      </Form>
      <Text role="caption">{status}</Text>
    </Card>
  );
}
