import { atom, useAtom } from 'jotai';
import {
  App,
  Button,
  Form,
  FormField,
  InputMenu,
  Modal,
  SubmitButton,
  Text,
  Toggle,
  VStack,
} from 'reacd';

const valueAtom = atom('');
const readonlyAtom = atom(false);
const disabledAtom = atom(false);
const loadingAtom = atom(false);
const errorAtom = atom(false);
const vetoAtom = atom(false);
const rtlAtom = atom(false);
const openAtom = atom(false);
const savedAtom = atom('Destination is not saved.');
const ITEMS = [
  { value: 'krakow', label: 'Kraków', description: 'Suggestion from Poland' },
  { value: 'paris', label: 'Paris', description: 'Suggestion from France' },
  {
    value: 'long',
    label: 'A destination with a long name that wraps on small screens',
    description: 'LongDescriptionWithoutSpacesToCheckSafeWrappingInsideThePopup',
  },
  { value: 'unavailable', label: 'Unavailable destination', disabled: true },
];

export function InputMenuExample() {
  const [value, setValue] = useAtom(valueAtom);
  const [readOnly, setReadOnly] = useAtom(readonlyAtom);
  const [disabled, setDisabled] = useAtom(disabledAtom);
  const [loading, setLoading] = useAtom(loadingAtom);
  const [error, setError] = useAtom(errorAtom);
  const [veto, setVeto] = useAtom(vetoAtom);
  const [rtl, setRtl] = useAtom(rtlAtom);
  const [open, setOpen] = useAtom(openAtom);
  const [saved, setSaved] = useAtom(savedAtom);
  return (
    <App direction={rtl ? 'rtl' : 'ltr'}>
      <VStack>
        <Form label="Destination form" onSubmit={() => setSaved('Destination saved.')}>
          <FormField name="destination" required disabled={disabled}>
            <InputMenu
              label="Destination"
              description="Choose a suggestion or type freely."
              items={ITEMS}
              value={value}
              onValueChange={setValue}
              onSuggestionSelect={() => !veto}
              readOnly={readOnly}
              disabled={false}
              status={error ? 'error' : loading ? 'loading' : 'ready'}
            />
          </FormField>
          <SubmitButton label="Save destination" />
        </Form>
        <Text>{`Accepted text: ${value}`}</Text>
        <Text>{saved}</Text>
        <Button label="Use Paris from host" onPress={() => setValue('Paris')} />
        <Toggle
          label="Read-only suggestions"
          checked={readOnly}
          onCheckedChange={setReadOnly}
        />
        <Toggle
          label="Disable suggestions"
          checked={disabled}
          onCheckedChange={setDisabled}
        />
        <Toggle
          label="Loading suggestions"
          checked={loading}
          onCheckedChange={setLoading}
        />
        <Toggle
          label="Suggestions unavailable"
          checked={error}
          onCheckedChange={setError}
        />
        <Toggle
          label="Decline suggested text"
          checked={veto}
          onCheckedChange={setVeto}
        />
        <Toggle
          label="Right to left suggestions"
          checked={rtl}
          onCheckedChange={setRtl}
        />
        <Modal
          title="Nested suggestions"
          description="The popup stays in this dialog."
          triggerLabel="Open nested suggestions"
          open={open}
          onOpenChange={setOpen}
        >
          <InputMenu
            label="Dialog destination"
            value={value}
            onValueChange={setValue}
            items={ITEMS}
          />
        </Modal>
      </VStack>
    </App>
  );
}
