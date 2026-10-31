import { Children } from 'react';
import type { ReactNode } from 'react';
import type { BlogPostsProps } from
  '@fastsprout/reacd/adapter-runtime/components/blog-posts/blog-posts.props.js';
import { BlogPost } from
  '@fastsprout/reacd/adapter-runtime/components/blog-post/blog-post.js';
import { EDITORIAL_DEFAULTS } from
  '@fastsprout/reacd/adapter-runtime/core/editorial-policy.js';

export function SharedBlogPosts({
  children,
  posts = EDITORIAL_DEFAULTS.entries,
  orientation = EDITORIAL_DEFAULTS.collectionOrientation,
}: BlogPostsProps): ReactNode {
  return (
    <ul
      className="reacd-node reacd-editorial-collection"
      data-orientation={orientation}
    >
      {posts.map(({ key, ...entry }) => (
        <li key={key}>
          <BlogPost {...entry} />
        </li>
      ))}
      {Children.map(children, (child) => (child == null ? null : <li>{child}</li>))}
    </ul>
  );
}
