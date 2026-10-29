import { atom, useAtom } from 'jotai';
import { BlogPost, BlogPosts, Text, Toggle, VStack } from 'reacd';

const verticalAtom = atom(false);

export function BlogPostsExample() {
  const [vertical, setVertical] = useAtom(verticalAtom);
  return (
    <VStack>
      <Toggle
        label="Vertical blog collection"
        checked={vertical}
        onCheckedChange={setVertical}
      />
      <BlogPosts
        orientation={vertical ? 'vertical' : 'horizontal'}
        posts={[
          {
            key: 'first',
            title: 'First illustrative article',
            href: '/',
            description: 'A keyed reference entry, not customer or publication data.',
          },
          {
            key: 'second',
            title: 'Second illustrative article',
            href: '/',
            description: 'Its order comes directly from the host declaration.',
          },
        ]}
      >
        <BlogPost title="Supplemental article">
          <Text>Safe additional content.</Text>
        </BlogPost>
      </BlogPosts>
    </VStack>
  );
}
