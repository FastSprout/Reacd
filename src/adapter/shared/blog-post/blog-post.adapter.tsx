import type { ReactNode } from 'react';
import type { BlogPostProps } from
  '@fastsprout/reacd/adapter-runtime/components/blog-post/blog-post.props.js';
import { EditorialEntrySurface } from
  '@fastsprout/reacd/adapter-runtime/renderer/editorial/editorial-entry.js';

export function SharedBlogPost(props: BlogPostProps): ReactNode {
  return <EditorialEntrySurface {...props} kind="blog" />;
}
