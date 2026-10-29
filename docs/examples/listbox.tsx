import { atom, useAtom } from 'jotai';
import { App, Button, Form, Listbox, SubmitButton, Text, Toggle, VStack } from 'reacd';

const primaryAtom = atom('42');
const additionalAtom = atom<readonly string[]>(['offline']);
const readOnlyAtom = atom(false);
const rejectAtom = atom(false);
const rtlAtom = atom(false);
const statusAtom = atom('Region selection is not saved.');
const REGIONS = [
  {
    value: '42',
    label: 'North region',
    description:
      'Account reference: ' +
      'NorthDistributionAccountReferenceForInternationalOrders.',
  },
  { value: 'west', label: 'West region', description: 'Available for new orders.' },
  { value: 'offline', label: 'Offline region', disabled: true },
] as const;

export function ListboxExample() {
  const [primary, setPrimary] = useAtom(primaryAtom);
  const [additional, setAdditional] = useAtom(additionalAtom);
  const [readOnly, setReadOnly] = useAtom(readOnlyAtom);
  const [reject, setReject] = useAtom(rejectAtom);
  const [rtl, setRtl] = useAtom(rtlAtom);
  const [status, setStatus] = useAtom(statusAtom);
  return (
    <VStack>
      <Toggle label="Right to left regions" checked={rtl} onCheckedChange={setRtl} />
      <Toggle
        label="Read-only regions"
        checked={readOnly}
        onCheckedChange={setReadOnly}
      />
      <Toggle
        label="Reject selection requests"
        checked={reject}
        onCheckedChange={setReject}
      />
      <App direction={rtl ? 'rtl' : 'ltr'}>
        <Form
          label="Region selection"
          onSubmit={() => setStatus('Region selection saved.')}
        >
          <Listbox
            label="Primary region"
            items={REGIONS}
            value={primary}
            onValueChange={(next) => {
              if (reject) return false;
              setPrimary(next);
              return true;
            }}
            name="primary"
            required
            readOnly={readOnly}
            description="Choose one region. Arrow keys move without selecting."
            clearLabel="Clear primary region"
          />
          <Listbox
            mode="multiple"
            label="Additional regions"
            items={REGIONS}
            value={additional}
            onValueChange={(next) => {
              if (reject) return false;
              setAdditional(next);
              return true;
            }}
            name="additional"
            readOnly={readOnly}
            clearLabel="Clear additional regions"
            description="Existing unavailable regions remain visible and clearable."
          />
          <SubmitButton label="Save regions" />
        </Form>
      </App>
      <Button
        label="Restore regions"
        onPress={() => {
          setPrimary('42');
          setAdditional(['offline']);
          setStatus('Region selection is not saved.');
        }}
      />
      <Text>{`Primary: ${primary || 'none'}`}</Text>
      <Text>{`Additional: ${additional.join(', ') || 'none'}`}</Text>
      <Text>{status}</Text>
    </VStack>
  );
}
