import { atom, useAtom } from 'jotai';
import { Button, Input, PageCTA, Text, Toggle, VStack } from 'reacd';

const draftAtom = atom('');
const confirmedAtom = atom(false);
const reverseAtom = atom(false);

export function PageCTAExample() {
  const [draft, setDraft] = useAtom(draftAtom);
  const [confirmed, setConfirmed] = useAtom(confirmedAtom);
  const [reverse, setReverse] = useAtom(reverseAtom);
  return (
    <VStack>
      <Toggle
        label="Reverse CTA regions"
        checked={reverse}
        onCheckedChange={setReverse}
      />
      <PageCTA
        title="Confirm the example draft"
        description="This action stays local."
        orientation="horizontal"
        reverse={reverse}
        variant="soft"
        links={<Button label="Confirm CTA draft" onPress={() => setConfirmed(true)} />}
        footer={
          <Text>
            {confirmed ? 'Draft confirmed locally' : 'Draft awaiting confirmation'}
          </Text>
        }
      >
        <Input label="Page CTA draft" value={draft} onValueChange={setDraft} />
      </PageCTA>
    </VStack>
  );
}
