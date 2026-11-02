import { atom, useAtom } from 'jotai';
import {
  App,
  Button,
  Form,
  Modal,
  SelectMenu,
  SubmitButton,
  Text,
  Toggle,
  VStack,
} from '@fastsprout/reacd';

const singleAtom = atom('');
const multipleAtom = atom<readonly string[]>([]);
const queryAtom = atom('');
const readonlyAtom = atom(false);
const queryReadonlyAtom = atom(false);
const disabledAtom = atom(false);
const loadingAtom = atom(false);
const errorAtom = atom(false);
const vetoAtom = atom(false);
const externalAtom = atom(false);
const rtlAtom = atom(false);
const openAtom = atom(false);
const savedAtom = atom('Selection is not saved.');
const ITEMS = [
  { value: '42', label: 'Answer', description: 'A numeric-looking option key' },
  { value: 'beta', label: 'Beta' },
  {
    value: 'long',
    label: 'An option with a long label that wraps on narrow screens',
    description: 'LongDescriptionWithoutSpacesForPopupWrappingConformance',
  },
  { value: 'unavailable', label: 'Unavailable choice', disabled: true },
];

export function SelectMenuExample() {
  const [single, setSingle] = useAtom(singleAtom);
  const [multiple, setMultiple] = useAtom(multipleAtom);
  const [query, setQuery] = useAtom(queryAtom);
  const [readOnly, setReadOnly] = useAtom(readonlyAtom);
  const [queryReadOnly, setQueryReadOnly] = useAtom(queryReadonlyAtom);
  const [disabled, setDisabled] = useAtom(disabledAtom);
  const [loading, setLoading] = useAtom(loadingAtom);
  const [error, setError] = useAtom(errorAtom);
  const [veto, setVeto] = useAtom(vetoAtom);
  const [external, setExternal] = useAtom(externalAtom);
  const [rtl, setRtl] = useAtom(rtlAtom);
  const [open, setOpen] = useAtom(openAtom);
  const [saved, setSaved] = useAtom(savedAtom);
  const status = error ? 'error' : loading ? 'loading' : 'ready';
  const visibleValues = external ? ['beta'] : undefined;
  return (
    <App direction={rtl ? 'rtl' : 'ltr'}>
      <VStack>
        <Form
          label="Single record form"
          onSubmit={() => setSaved('Single record saved.')}
        >
          <SelectMenu
            items={ITEMS}
            readOnly={readOnly}
            disabled={disabled}
            required
            status={status}
            visibleValues={visibleValues}
            label="Primary record"
            name="primary"
            value={single}
            onValueChange={(next) => {
              if (veto) return false;
              setSingle(next);
              return true;
            }}
            query={query}
            onQueryChange={setQuery}
            queryReadOnly={queryReadOnly}
          />
          <SubmitButton label="Save primary record" />
        </Form>
        <Form
          label="Multiple records form"
          onSubmit={() => setSaved('Multiple records saved.')}
        >
          <SelectMenu
            items={ITEMS}
            readOnly={readOnly}
            disabled={disabled}
            required
            status={status}
            visibleValues={visibleValues}
            label="Related records"
            name="related"
            mode="multiple"
            value={multiple}
            onValueChange={(next) => {
              if (veto) return false;
              setMultiple(next);
              return true;
            }}
          />
          <SubmitButton label="Save related records" />
        </Form>
        <Text>{`Single key: ${single}`}</Text>
        <Text>{`Multiple keys: ${multiple.join(', ')}`}</Text>
        <Text>{`Independent query: ${query}`}</Text>
        <Text>{saved}</Text>
        <Toggle
          label="Read-only selection"
          checked={readOnly}
          onCheckedChange={setReadOnly}
        />
        <Toggle
          label="Read-only search"
          checked={queryReadOnly}
          onCheckedChange={setQueryReadOnly}
        />
        <Toggle
          label="Disable selection"
          checked={disabled}
          onCheckedChange={setDisabled}
        />
        <Toggle
          label="Loading records"
          checked={loading}
          onCheckedChange={setLoading}
        />
        <Toggle
          label="Choices unavailable"
          checked={error}
          onCheckedChange={setError}
        />
        <Toggle label="Decline selection" checked={veto} onCheckedChange={setVeto} />
        <Toggle
          label="External Beta results"
          checked={external}
          onCheckedChange={setExternal}
        />
        <Toggle
          label="Right to left selection"
          checked={rtl}
          onCheckedChange={setRtl}
        />
        <Button
          label="Restore unavailable selection"
          onPress={() => {
            setSingle('unavailable');
            setMultiple(['unavailable']);
          }}
        />
        <Modal
          title="Nested selection"
          description="The choice popup stays in this dialog."
          triggerLabel="Open nested selection"
          open={open}
          onOpenChange={setOpen}
        >
          <SelectMenu
            label="Dialog records"
            items={ITEMS}
            value={single}
            onValueChange={setSingle}
          />
        </Modal>
      </VStack>
    </App>
  );
}
