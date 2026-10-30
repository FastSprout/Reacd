import { atom, useAtom } from 'jotai';
import {
  App,
  Button,
  Calendar,
  Form,
  SubmitButton,
  Text,
  Toggle,
  VStack,
} from '@fastsprout/reacd';
import type { CalendarProps } from '@fastsprout/reacd';

type Range = Extract<CalendarProps, { mode: 'range' }>['value'];
const valueAtom = atom<string | null>('2026-10-29');
const rangeAtom = atom<Range>({ start: '2026-10-29', end: null });
const rangeModeAtom = atom(false);
const readOnlyAtom = atom(false);
const disabledAtom = atom(false);
const rtlAtom = atom(false);
const monthsAtom = atom(false);
const statusAtom = atom('Calendar selection is not saved.');
const REFERENCE_DATE = '2026-10-29';
const MINIMUM_DATE = '2026-10-01';
const MAXIMUM_DATE = '2026-12-31';

export function CalendarExample() {
  const [value, setValue] = useAtom(valueAtom);
  const [range, setRange] = useAtom(rangeAtom);
  const [rangeMode, setRangeMode] = useAtom(rangeModeAtom);
  const [readOnly, setReadOnly] = useAtom(readOnlyAtom);
  const [disabled, setDisabled] = useAtom(disabledAtom);
  const [rtl, setRtl] = useAtom(rtlAtom);
  const [twoMonths, setTwoMonths] = useAtom(monthsAtom);
  const [status, setStatus] = useAtom(statusAtom);
  return (
    <VStack>
      <Toggle
        label="Calendar range selection"
        checked={rangeMode}
        onCheckedChange={setRangeMode}
      />
      <Toggle label="Right to left calendar" checked={rtl} onCheckedChange={setRtl} />
      <Toggle
        label="Show two calendar months"
        checked={twoMonths}
        onCheckedChange={setTwoMonths}
      />
      <App direction={rtl ? 'rtl' : 'ltr'}>
        <VStack>
          <Form
            label="Calendar form"
            onSubmit={() => setStatus('Calendar selection saved.')}
          >
            {rangeMode ? (
              <Calendar
                mode="range"
                label="Delivery calendar"
                referenceDate={REFERENCE_DATE}
                value={range}
                onValueChange={setRange}
                min={MINIMUM_DATE}
                max={MAXIMUM_DATE}
                numberOfMonths={twoMonths ? 2 : 1}
                readOnly={readOnly}
                disabled={disabled}
                description="Choose the first and last delivery dates."
                required
                name="delivery"
              />
            ) : (
              <Calendar
                label="Delivery calendar"
                referenceDate={REFERENCE_DATE}
                value={value}
                onValueChange={setValue}
                min={MINIMUM_DATE}
                max={MAXIMUM_DATE}
                numberOfMonths={twoMonths ? 2 : 1}
                readOnly={readOnly}
                disabled={disabled}
                description="Choose a delivery date."
                required
                name="delivery"
              />
            )}
            <SubmitButton label="Save calendar selection" />
          </Form>
          <Toggle
            label="Read-only calendar"
            checked={readOnly}
            onCheckedChange={setReadOnly}
          />
          <Toggle
            label="Disable calendar"
            checked={disabled}
            onCheckedChange={setDisabled}
          />
          <Button
            label="Clear calendar selection"
            onPress={() => {
              setValue(null);
              setRange({ start: null, end: null });
              setStatus('Calendar selection is not saved.');
            }}
            disabled={readOnly || disabled}
            intent="secondary"
          />
          <Text>
            {rangeMode
              ? `Range: ${range.start ?? 'empty'} to ${range.end ?? 'empty'}`
              : `Date: ${value ?? 'empty'}`}
          </Text>
          <Text>{status}</Text>
        </VStack>
      </App>
    </VStack>
  );
}
