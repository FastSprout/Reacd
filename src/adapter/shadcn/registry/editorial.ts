import { renderEntry } from '../../../renderer/contracts/render-entry.js';
import { blogPostSchema } from '../../../schema/blog-post/blog-post.schema.js';
import { ShadcnBlogPost } from '../blog-post/blog-post.adapter.js';
import { blogPostsSchema } from '../../../schema/blog-posts/blog-posts.schema.js';
import { ShadcnBlogPosts } from '../blog-posts/blog-posts.adapter.js';
import { changelogVersionSchema }
  from '../../../schema/changelog-version/changelog-version.schema.js';
import { ShadcnChangelogVersion }
  from '../changelog-version/changelog-version.adapter.js';
import { changelogVersionsSchema }
  from '../../../schema/changelog-versions/changelog-versions.schema.js';
import { ShadcnChangelogVersions }
  from '../changelog-versions/changelog-versions.adapter.js';

export const editorialEntries = {
  BlogPost: renderEntry('BlogPost', blogPostSchema, ShadcnBlogPost),
  BlogPosts: renderEntry('BlogPosts', blogPostsSchema, ShadcnBlogPosts),
  ChangelogVersion: renderEntry(
    'ChangelogVersion',
    changelogVersionSchema,
    ShadcnChangelogVersion,
  ),
  ChangelogVersions: renderEntry(
    'ChangelogVersions',
    changelogVersionsSchema,
    ShadcnChangelogVersions,
  ),
};
