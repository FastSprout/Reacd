import { atom, useAtom } from 'jotai';
import { Input, PageCard, Text } from 'reacd';

const draftAtom = atom('');

export function PageCardExample() {
  const [draft, setDraft] = useAtom(draftAtom);
  return (
    <PageCard
      title="Read card reference"
      href="/"
      variant="subtle"
      intent="primary"
      highlight
      spotlight
      description="Navigation belongs to the title. Editing remains independent."
      header={<Text weight="bold">Interactive card example</Text>}
      footer={<Text>Draft values belong to this application's isolated store.</Text>}
    >
      <Input label="Page card draft" value={draft} onValueChange={setDraft} />
    </PageCard>
  );
}
