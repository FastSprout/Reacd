import type { ReactNode } from 'react';
import type { BlogPostProps } from '../../../components/blog-post/blog-post.props.js';
import { EditorialEntrySurface } from '../../../renderer/editorial/editorial-entry.js';

export function ShadcnBlogPost(props: BlogPostProps): ReactNode {
  return <EditorialEntrySurface {...props} kind="blog" />;
}
