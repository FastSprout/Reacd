import { atom, useAtom } from 'jotai';
import {
  App,
  Button,
  Carousel,
  Form,
  Input,
  InputNumber,
  Progress,
  SubmitButton,
  Text,
  Toggle,
  VStack,
} from 'reacd';
const indexAtom = atom(0);
const draftAtom = atom('Draft profile');
const loopAtom = atom(false);
const verticalAtom = atom(false);
const rtlAtom = atom(false);
const readonlyAtom = atom(false);
const disabledAtom = atom(false);
const emptyAtom = atom(false);
const stateAtom = atom<'ready' | 'loading' | 'error'>('ready');
const reviewAtom = atom(0);
const retryAtom = atom(0);
const profileQuantityAtom = atom<number | null>(1);
const reviewQuantityAtom = atom<number | null>(null);
const submissionAtom = atom(0);

export function CarouselExample() {
  const [index, setIndex] = useAtom(indexAtom);
  const [draft, setDraft] = useAtom(draftAtom);
  const [loop, setLoop] = useAtom(loopAtom);
  const [vertical, setVertical] = useAtom(verticalAtom);
  const [rtl, setRtl] = useAtom(rtlAtom);
  const [readOnly, setReadOnly] = useAtom(readonlyAtom);
  const [disabled, setDisabled] = useAtom(disabledAtom);
  const [empty, setEmpty] = useAtom(emptyAtom);
  const [state, setState] = useAtom(stateAtom);
  const [reviews, setReviews] = useAtom(reviewAtom);
  const [retries, setRetries] = useAtom(retryAtom);
  const [profileQuantity, setProfileQuantity] = useAtom(profileQuantityAtom);
  const [reviewQuantity, setReviewQuantity] = useAtom(reviewQuantityAtom);
  const [submissions, setSubmissions] = useAtom(submissionAtom);
  const items = [
    {
      id: 'profile',
      label: 'Profile',
      children: (
        <VStack>
          <Text>Profile details</Text>
          <Input label="Profile slide draft" value={draft} onValueChange={setDraft} />
          <InputNumber
            label="Profile quantity"
            name="profileQuantity"
            value={profileQuantity}
            onValueChange={setProfileQuantity}
            required
          />
        </VStack>
      ),
    },
    {
      id: 'review',
      label: 'Review',
      children: (
        <VStack>
          <Text>Review the profile before continuing.</Text>
          <InputNumber
            label="Review quantity"
            name="reviewQuantity"
            value={reviewQuantity}
            onValueChange={setReviewQuantity}
            required
          />
          <Button label="Review slide action" onPress={() => setReviews(reviews + 1)} />
        </VStack>
      ),
    },
    {
      id: 'status',
      label: 'Status',
      children: <Progress label="Review progress" value={75} />,
    },
  ];
  return (
    <VStack>
      <Toggle label="Right to left carousel" checked={rtl} onCheckedChange={setRtl} />
      <App direction={rtl ? 'rtl' : 'ltr'}>
        <VStack>
          <Form
            label="Slide entry form"
            onSubmit={() => setSubmissions(submissions + 1)}
          >
            <Carousel
              label="Reference slides"
              items={empty ? [] : items}
              value={empty ? 0 : index}
              onValueChange={setIndex}
              loop={loop}
              orientation={vertical ? 'vertical' : 'horizontal'}
              readOnly={readOnly}
              disabled={disabled}
              state={state}
              onRetry={() => {
                setState('ready');
                setRetries(retries + 1);
              }}
            />
            <SubmitButton label="Submit active slide" />
          </Form>
          <Button
            label="Advance carousel from host"
            disabled={empty}
            onPress={() => setIndex((previous) => (previous + 1) % items.length)}
          />
          <Toggle label="Loop carousel" checked={loop} onCheckedChange={setLoop} />
          <Toggle
            label="Vertical carousel keys"
            checked={vertical}
            onCheckedChange={setVertical}
          />
          <Toggle
            label="Readonly carousel"
            checked={readOnly}
            onCheckedChange={setReadOnly}
          />
          <Toggle
            label="Disable carousel navigation"
            checked={disabled}
            onCheckedChange={setDisabled}
          />
          <Toggle label="Empty carousel" checked={empty} onCheckedChange={setEmpty} />
          <Button label="Preview loading slides" onPress={() => setState('loading')} />
          <Button label="Preview slide error" onPress={() => setState('error')} />
          <Text>{`Slide reviews: ${reviews}`}</Text>
          <Text>{`Slide retries: ${retries}`}</Text>
          <Text>{`Slide form submissions: ${submissions}`}</Text>
        </VStack>
      </App>
    </VStack>
  );
}
