import { atom, useAtom } from 'jotai';
import {
  App,
  Form,
  InputRating,
  SubmitButton,
  Text,
  Toggle,
  VStack,
} from '@fastsprout/reacd';

const rtlAtom = atom(false);
const valueAtom = atom(2.5);
const readOnlyAtom = atom(false);
const statusAtom = atom('Rating is not saved.');
const RATING_LENGTH = 5;
const RATING_STEP = 0.5;

export function InputRatingExample() {
  const [value, setValue] = useAtom(valueAtom);
  const [readOnly, setReadOnly] = useAtom(readOnlyAtom);
  const [status, setStatus] = useAtom(statusAtom);
  const [rtl, setRtl] = useAtom(rtlAtom);
  return (
    <VStack>
      <Toggle label="Right to left rating" checked={rtl} onCheckedChange={setRtl} />
      <App direction={rtl ? 'rtl' : 'ltr'}>
        <VStack>
          <Form label="Rating form" onSubmit={() => setStatus('Rating saved.')}>
            <InputRating
              label="Service rating"
              value={value}
              onValueChange={setValue}
              length={RATING_LENGTH}
              step={RATING_STEP}
              readOnly={readOnly}
              description="Choose up to five stars, including half stars."
              hoverable
              clearable
              required
              name="serviceRating"
            />
            <SubmitButton label="Save rating" />
          </Form>
          <Toggle
            label="Read-only rating"
            checked={readOnly}
            onCheckedChange={setReadOnly}
          />
          <Text>{`Rating: ${value} of ${RATING_LENGTH}`}</Text>
          <Text>{status}</Text>
        </VStack>
      </App>
    </VStack>
  );
}
