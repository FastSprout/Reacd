import { atom, useAtom } from 'jotai';
import { App, Button, Form, Input, SubmitButton, Text, Toggle, VStack } from 'reacd';
import type { FormSummaryIssue } from 'reacd';

const PROJECT_NAME = 'Local project';
const EXAMPLE_SUMMARY: readonly FormSummaryIssue[] = [
  {
    label: 'Network',
    message: 'The previous example failed. Retry is available.',
  },
];
const nameAtom = atom(PROJECT_NAME);
const summaryAtom = atom<readonly FormSummaryIssue[]>(EXAMPLE_SUMMARY);
const attemptsAtom = atom(0);
const submittingAtom = atom(false);
const disabledAtom = atom(false);
const rtlAtom = atom(false);

export function FormExample() {
  const [name, setName] = useAtom(nameAtom);
  const [summary, setSummary] = useAtom(summaryAtom);
  const [attempts, setAttempts] = useAtom(attemptsAtom);
  const [submitting, setSubmitting] = useAtom(submittingAtom);
  const [disabled, setDisabled] = useAtom(disabledAtom);
  const [rtl, setRtl] = useAtom(rtlAtom);
  return (
    <VStack>
      <Toggle
        label="Right to left project form"
        checked={rtl}
        onCheckedChange={setRtl}
      />
      <App direction={rtl ? 'rtl' : 'ltr'}>
        <VStack>
          <Form
            label="Project form"
            disabled={disabled}
            submitting={submitting}
            errors={summary}
            onSubmit={() => setAttempts((value) => value + 1)}
          >
            <Input
              label="Project name"
              value={name}
              onValueChange={setName}
              name="project"
              required
              maxLength={100}
            />
            <SubmitButton label="Submit project" />
          </Form>
          <Toggle
            label="Form is submitting"
            checked={submitting}
            onCheckedChange={setSubmitting}
          />
          <Toggle
            label="Disable project form"
            checked={disabled}
            onCheckedChange={setDisabled}
          />
          <Button
            label="Add retryable summary"
            onPress={() => setSummary(EXAMPLE_SUMMARY)}
          />
          <Button label="Clear form summary" onPress={() => setSummary([])} />
          <Button label="Clear project name" onPress={() => setName('')} />
          <Button label="Restore project name" onPress={() => setName(PROJECT_NAME)} />
          <Text>{`Submission attempts: ${attempts}`}</Text>
        </VStack>
      </App>
    </VStack>
  );
}
