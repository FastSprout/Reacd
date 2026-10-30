import { atom, useAtom } from 'jotai';
import { Alert, Button, Text, Toggle, VStack } from '@fastsprout/reacd';
const openAtom = atom(true);
const readOnlyAtom = atom(false);
const reviewAtom = atom(0);
export function AlertExample() {
  const [open, setOpen] = useAtom(openAtom);
  const [readOnly, setReadOnly] = useAtom(readOnlyAtom);
  const [reviews, setReviews] = useAtom(reviewAtom);
  return (
    <VStack>
      <Alert
        title="Review delivery details"
        message="Confirm the details before continuing."
        intent="warning"
        open={open}
        onOpenChange={readOnly ? undefined : setOpen}
        actions={[
          {
            id: 'review',
            label: 'Review delivery',
            onPress: () => setReviews(reviews + 1),
          },
        ]}
      />
      <Toggle
        label="Readonly alert visibility"
        checked={readOnly}
        onCheckedChange={setReadOnly}
      />
      <Button
        label="Show delivery alert"
        onPress={() => setOpen(true)}
        disabled={open}
      />
      <Text>{`Delivery review requests: ${reviews}`}</Text>
    </VStack>
  );
}
