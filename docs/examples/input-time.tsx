import { atom, useAtom } from 'jotai';
import {
  App,
  Button,
  Form,
  InputTime,
  SubmitButton,
  Text,
  Toggle,
  VStack,
} from 'reacd';

const arrivalAtom = atom<string | null>('12:30:00');
const availabilityAtom = atom<Readonly<{ start: string | null; end: string | null }>>({
  start: '09:00:00',
  end: '17:00:00',
});
const readOnlyAtom = atom(false);
const disabledAtom = atom(false);
const rtlAtom = atom(false);
const arabicAtom = atom(false);
const statusAtom = atom('Times are not saved.');

export function InputTimeExample() {
  const [arrival, setArrival] = useAtom(arrivalAtom);
  const [availability, setAvailability] = useAtom(availabilityAtom);
  const [readOnly, setReadOnly] = useAtom(readOnlyAtom);
  const [disabled, setDisabled] = useAtom(disabledAtom);
  const [rtl, setRtl] = useAtom(rtlAtom);
  const [arabic, setArabic] = useAtom(arabicAtom);
  const [status, setStatus] = useAtom(statusAtom);
  return (
    <VStack>
      <Toggle label="Right to left times" checked={rtl} onCheckedChange={setRtl} />
      <Toggle label="Arabic time locale" checked={arabic} onCheckedChange={setArabic} />
      <App direction={rtl ? 'rtl' : 'ltr'}>
        <VStack>
          <Form label="Times form" onSubmit={() => setStatus('Times saved.')}>
            <InputTime
              label="Arrival time"
              description="Local wall-clock time with second precision."
              value={arrival}
              onValueChange={setArrival}
              locale={arabic ? 'ar-EG' : 'en-US'}
              required
              name="arrival"
              readOnly={readOnly}
              disabled={disabled}
            />
            <InputTime
              mode="range"
              label="Availability"
              description="Both endpoints are required."
              value={availability}
              onValueChange={setAvailability}
              locale={arabic ? 'ar-EG' : 'en-US'}
              required
              name="availability"
              readOnly={readOnly}
              disabled={disabled}
            />
            <SubmitButton label="Save times" />
          </Form>
          <Toggle
            label="Read-only times"
            checked={readOnly}
            onCheckedChange={setReadOnly}
          />
          <Toggle
            label="Disable times"
            checked={disabled}
            onCheckedChange={setDisabled}
          />
          <Button
            label="Restore sample times"
            intent="secondary"
            onPress={() => {
              setArrival('12:30:00');
              setAvailability({ start: '09:00:00', end: '17:00:00' });
            }}
          />
          <Text>{`Arrival: ${arrival ?? 'empty'}`}</Text>
          <Text>{`Availability: ${availability.start ?? 'empty'} to ${
            availability.end ?? 'empty'
          }`}</Text>
          <Text>{status}</Text>
        </VStack>
      </App>
    </VStack>
  );
}
