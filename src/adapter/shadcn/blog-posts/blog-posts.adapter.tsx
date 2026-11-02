import { Children } from 'react';
import type { BlogPostsProps } from
  '@fastsprout/reacd/adapter-runtime/components/blog-posts/blog-posts.props.js';
import { EDITORIAL_DEFAULTS } from
  '@fastsprout/reacd/adapter-runtime/core/editorial-policy.js';
import { PAGE_PRESENTATION_POLICY } from
  '@fastsprout/reacd/adapter-runtime/core/page-presentation-policy.js';
import { CardContent } from '../vendor/ui/card.js';
import { ShadcnBlogPost } from '../blog-post/blog-post.adapter.js';

export type ShadcnBlogPostsProps = BlogPostsProps;
export function ShadcnBlogPosts({
  posts = EDITORIAL_DEFAULTS.entries,
  children,
  orientation = EDITORIAL_DEFAULTS.collectionOrientation,
}: BlogPostsProps) {
  const track = PAGE_PRESENTATION_POLICY.contentTrackRem;
  return (
    <CardContent
      role="list"
      className="grid min-w-0 p-0"
      style={{
        gap: 'var(--space-medium)',
        overflowWrap: 'anywhere',
        gridTemplateColumns:
          orientation === 'horizontal'
            ? `repeat(auto-fit, minmax(min(100%, ${track}rem), 1fr))`
            : 'minmax(0, 1fr)',
      }}
    >
      {posts.map(({ key, ...post }) => (
        <CardContent role="listitem" key={key} className="min-w-0 p-0">
          <ShadcnBlogPost {...post} />
        </CardContent>
      ))}
      {Children.map(Children.toArray(children), (child) => (
        <CardContent role="listitem" className="min-w-0 p-0">
          {child}
        </CardContent>
      ))}
    </CardContent>
  );
}
