import { atom, useAtom } from 'jotai';
import { Card, Checkbox, Text } from '@fastsprout/reacd';

const reviewAtom = atom(false);
const feedbackAtom = atom(true);
const publishAtom = atom(false);

export function TasksCard() {
  const [review, setReview] = useAtom(reviewAtom);
  const [feedback, setFeedback] = useAtom(feedbackAtom);
  const [publish, setPublish] = useAtom(publishAtom);
  return (
    <Card label="Project tasks">
      <Text role="subheadline">Today’s checklist</Text>
      <Checkbox
        label="Review the proposal"
        checked={review}
        onCheckedChange={setReview}
      />
      <Checkbox
        label="Collect feedback"
        checked={feedback}
        onCheckedChange={setFeedback}
      />
      <Checkbox
        label="Prepare the release"
        checked={publish}
        onCheckedChange={setPublish}
      />
    </Card>
  );
}
