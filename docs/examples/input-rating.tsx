import { atom, useAtom } from 'jotai';
import { InputRating, Text, VStack } from '@fastsprout/reacd';

const ratingAtom = atom(2.5);

export function InputRatingExample() {
  const [rating, setRating] = useAtom(ratingAtom);
  return (
    <VStack>
      <InputRating
        label="Service rating"
        value={rating}
        onValueChange={setRating}
        step={0.5}
        clearable
        description="Choose up to five, including half steps."
      />
      <Text>{`Selected rating: ${rating}`}</Text>
    </VStack>
  );
}
