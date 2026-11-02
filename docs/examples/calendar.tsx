import { atom, useAtom } from 'jotai';
import { Calendar, Text, VStack } from '@fastsprout/reacd';

const dayAtom = atom<string | null>(null);

export function CalendarExample() {
  const [day, setDay] = useAtom(dayAtom);

  return (
    <VStack>
      <Calendar
        label="Delivery calendar"
        referenceDate="2026-11-01"
        value={day}
        onValueChange={setDay}
      />
      <Text>{day === null ? 'Choose a delivery day.' : `Delivery day: ${day}`}</Text>
    </VStack>
  );
}
