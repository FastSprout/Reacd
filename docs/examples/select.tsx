import { atom, useAtom } from 'jotai';
import {
  App,
  Form,
  FormField,
  Select,
  SubmitButton,
  Text,
  Toggle,
  VStack,
} from '@fastsprout/reacd';

const LONG_LABEL = 'Regional approval and international logistics coordination';
const items = [
  { value: 'draft', label: 'Draft' },
  { value: 'review', label: LONG_LABEL, description: 'Review before release.' },
  { value: 'retired', label: 'Retired', disabled: true },
];
const singleAtom = atom('draft');
const multipleAtom = atom<readonly string[]>(['draft']);
const readOnlyAtom = atom(false);
const loadingAtom = atom(false);
const rtlAtom = atom(false);
const statusAtom = atom('Selection is not saved.');

export function SelectExample() {
  const [single, setSingle] = useAtom(singleAtom);
  const [multiple, setMultiple] = useAtom(multipleAtom);
  const [readOnly, setReadOnly] = useAtom(readOnlyAtom);
  const [loading, setLoading] = useAtom(loadingAtom);
  const [rtl, setRtl] = useAtom(rtlAtom);
  const [status, setStatus] = useAtom(statusAtom);
  return (
    <VStack>
      <Toggle label="Right to left choices" checked={rtl} onCheckedChange={setRtl} />
      <App direction={rtl ? 'rtl' : 'ltr'}>
        <VStack>
          <Form label="Choice form" onSubmit={() => setStatus('Selection saved.')}>
            <FormField name="status" required>
              <Select
                label="Release status"
                value={single}
                items={items}
                onValueChange={setSingle}
                readOnly={readOnly}
                loading={loading}
                clearable
              />
            </FormField>
            <Select
              mode="multiple"
              label="Included statuses"
              name="included"
              value={multiple}
              items={items}
              onValueChange={setMultiple}
              readOnly={readOnly}
              loading={loading}
              clearable
            />
            <SubmitButton label="Save choices" />
          </Form>
          <Select
            label="Release reader"
            value={single}
            items={items}
            onValueChange={setSingle}
            readOnly
          />
          <Toggle
            label="Read-only choices"
            checked={readOnly}
            onCheckedChange={setReadOnly}
          />
          <Toggle
            label="Loading choices"
            checked={loading}
            onCheckedChange={setLoading}
          />
          <Text>{status}</Text>
        </VStack>
      </App>
    </VStack>
  );
}
