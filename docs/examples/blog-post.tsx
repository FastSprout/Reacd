import { atom, useAtom } from 'jotai';
import { BlogPost, Input, Text } from '@fastsprout/reacd';

const draftAtom = atom('');
const inspectedAtom = atom(false);

export function BlogPostExample() {
  const [draft, setDraft] = useAtom(draftAtom);
  const [inspected, setInspected] = useAtom(inspectedAtom);
  return (
    <BlogPost
      title="Inspect illustrative article"
      onPress={() => setInspected(true)}
      description="Reference example data, not a publication announcement."
      date="2026-10-29"
      dateLabel="Example record date"
      badge={<Text>Example category</Text>}
      authors={<Text>Author slot placeholder</Text>}
      image={{
        src: '/missing-editorial-example.png',
        alt: 'Unavailable editorial image placeholder',
      }}
      footer={
        <Text>{inspected ? 'Article inspected' : 'Article awaiting inspection'}</Text>
      }
    >
      <Input label="Blog post draft" value={draft} onValueChange={setDraft} />
    </BlogPost>
  );
}
