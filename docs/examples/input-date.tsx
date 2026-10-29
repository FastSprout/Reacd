import { atom, useAtom } from 'jotai';
import {
  App,
  Button,
  Form,
  InputDate,
  SubmitButton,
  Text,
  Toggle,
  VStack,
} from 'reacd';

const REFERENCE_DATE = '2024-02-28';
const eventAtom = atom<string | null>('2024-02-28');
const bookingAtom = atom<Readonly<{ start: string | null; end: string | null }>>({
  start: '2024-02-28',
  end: '2024-03-01',
});
const readOnlyAtom = atom(false);
const disabledAtom = atom(false);
const rtlAtom = atom(false);
const arabicAtom = atom(false);
const statusAtom = atom('Dates are not saved.');
const resetRevisionAtom = atom(0);

export function InputDateExample() {
  const [event, setEvent] = useAtom(eventAtom);
  const [booking, setBooking] = useAtom(bookingAtom);
  const [readOnly, setReadOnly] = useAtom(readOnlyAtom);
  const [disabled, setDisabled] = useAtom(disabledAtom);
  const [rtl, setRtl] = useAtom(rtlAtom);
  const [arabic, setArabic] = useAtom(arabicAtom);
  const [status, setStatus] = useAtom(statusAtom);
  const [resetRevision, setResetRevision] = useAtom(resetRevisionAtom);
  return (
    <VStack>
      <Toggle label="Right to left dates" checked={rtl} onCheckedChange={setRtl} />
      <Toggle label="Arabic date locale" checked={arabic} onCheckedChange={setArabic} />
      <App direction={rtl ? 'rtl' : 'ltr'}>
        <VStack>
          <Form label="Dates form" onSubmit={() => setStatus('Dates saved.')}>
            <InputDate
              key={`event-${resetRevision}`}
              label="Event date"
              referenceDate={REFERENCE_DATE}
              description="Gregorian date with an explicit reference."
              value={event}
              onValueChange={setEvent}
              locale={arabic ? 'ar-EG' : 'en-US'}
              required
              name="event"
              readOnly={readOnly}
              disabled={disabled}
            />
            <InputDate
              key={`booking-${resetRevision}`}
              mode="range"
              label="Booking dates"
              referenceDate={REFERENCE_DATE}
              description="Both endpoints are required."
              value={booking}
              onValueChange={setBooking}
              locale={arabic ? 'ar-EG' : 'en-US'}
              required
              name="booking"
              readOnly={readOnly}
              disabled={disabled}
            />
            <SubmitButton label="Save dates" />
          </Form>
          <Toggle
            label="Read-only dates"
            checked={readOnly}
            onCheckedChange={setReadOnly}
          />
          <Toggle
            label="Disable dates"
            checked={disabled}
            onCheckedChange={setDisabled}
          />
          <Button
            label="Restore sample dates"
            intent="secondary"
            onPress={() => {
              setEvent('2024-02-28');
              setBooking({ start: '2024-02-28', end: '2024-03-01' });
              setResetRevision((revision) => revision + 1);
            }}
          />
          <Text>{`Event date: ${event ?? 'empty'}`}</Text>
          <Text>{`Booking dates: ${booking.start ?? 'empty'} to ${
            booking.end ?? 'empty'
          }`}</Text>
          <Text>{status}</Text>
        </VStack>
      </App>
    </VStack>
  );
}
