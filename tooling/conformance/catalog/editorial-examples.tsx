import { atom, useAtom } from 'jotai';
import { App, Section, Toggle, VStack } from '@fastsprout/reacd';
import { BlogPostExample } from '../../../docs/examples/blog-post.js';
import { BlogPostsExample } from '../../../docs/examples/blog-posts.js';
import { ChangelogVersionExample } from '../../../docs/examples/changelog-version.js';
import { ChangelogVersionsExample } from '../../../docs/examples/changelog-versions.js';

const rtlAtom = atom(false);

export function EditorialExamples() {
  const [rtl, setRtl] = useAtom(rtlAtom);
  return (
    <Section title="Editorial page components">
      <Toggle label="Editorial RTL" checked={rtl} onCheckedChange={setRtl} />
      <App direction={rtl ? 'rtl' : 'ltr'} language="en">
        <VStack>
          <BlogPostExample />
          <BlogPostsExample />
          <ChangelogVersionExample />
          <ChangelogVersionsExample />
        </VStack>
      </App>
    </Section>
  );
}
