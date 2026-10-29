import { atom, useAtom } from 'jotai';
import { ContentSearchButton, Text, VStack } from 'reacd';

const requestedAtom = atom(false);

export function ContentSearchButtonExample() {
  const [requested, setRequested] = useAtom(requestedAtom);
  return (
    <VStack>
      <ContentSearchButton
        label="Request host search"
        open={requested}
        onOpenChange={setRequested}
      />
      <Text>
        {requested ? 'The host received a search request.' : 'Waiting for a request.'}
      </Text>
    </VStack>
  );
}
