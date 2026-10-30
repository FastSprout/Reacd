import { atom, useAtom } from 'jotai';
import { Button, Card, Text, Toggle, VStack } from '@fastsprout/reacd';
const headerAtom = atom(true);
const footerAtom = atom(true);
const reviewAtom = atom(0);
export function CardExample() {
  const [header, setHeader] = useAtom(headerAtom);
  const [footer, setFooter] = useAtom(footerAtom);
  const [reviews, setReviews] = useAtom(reviewAtom);
  return (
    <VStack>
      <Card
        label="Review card"
        header={header ? <Text weight="bold">Review summary</Text> : undefined}
        footer={
          footer ? (
            <Button
              label="Review card details"
              onPress={() => setReviews(reviews + 1)}
            />
          ) : undefined
        }
      >
        <Text>Header, body and footer use the same closed component vocabulary.</Text>
        <Text>{`Review requests: ${reviews}`}</Text>
      </Card>
      <Toggle label="Show card header" checked={header} onCheckedChange={setHeader} />
      <Toggle label="Show card footer" checked={footer} onCheckedChange={setFooter} />
    </VStack>
  );
}
