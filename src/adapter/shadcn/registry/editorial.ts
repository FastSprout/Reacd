import { renderEntry } from
  '@fastsprout/reacd/adapter-runtime/renderer/contracts/render-entry.js';
import { blogPostSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/blog-post/blog-post.schema.js';
import { ShadcnBlogPost } from '../blog-post/blog-post.adapter.js';
import { blogPostsSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/blog-posts/blog-posts.schema.js';
import { ShadcnBlogPosts } from '../blog-posts/blog-posts.adapter.js';
import { changelogVersionSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/changelog-version/index.js';
import { ShadcnChangelogVersion } from
  '../changelog-version/changelog-version.adapter.js';
import { changelogVersionsSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/changelog-versions/index.js';
import { ShadcnChangelogVersions } from
  '../changelog-versions/changelog-versions.adapter.js';

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
