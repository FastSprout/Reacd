import { atom, useAtom } from 'jotai';
import { InputTime, Text, VStack } from '@fastsprout/reacd';

const timeAtom = atom<string | null>('09:00:00');

export function InputTimeExample() {
  const [time, setTime] = useAtom(timeAtom);

  return (
    <VStack>
      <InputTime
        label="Meeting time"
        locale="en-GB"
        value={time}
        onValueChange={setTime}
      />
      <Text>{time === null ? 'Choose a meeting time.' : `Meeting time: ${time}`}</Text>
    </VStack>
  );
}
