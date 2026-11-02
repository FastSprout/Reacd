import { atom, useAtom } from 'jotai';
import { InputDate, Text, VStack } from '@fastsprout/reacd';

const dateAtom = atom<string | null>('2026-11-16');

export function InputDateExample() {
  const [date, setDate] = useAtom(dateAtom);

  return (
    <VStack>
      <InputDate
        label="Delivery date"
        referenceDate="2026-11-01"
        value={date}
        onValueChange={setDate}
      />
      <Text>
        {date === null ? 'Choose a delivery date.' : `Delivery date: ${date}`}
      </Text>
    </VStack>
  );
}
