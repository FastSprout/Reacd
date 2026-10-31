import { renderEntry } from
  '@fastsprout/reacd/adapter-runtime/renderer/contracts/render-entry.js';
import { blogPostSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/blog-post/blog-post.schema.js';
import { MuiBlogPost } from '../blog-post/blog-post.adapter.js';
import { blogPostsSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/blog-posts/blog-posts.schema.js';
import { MuiBlogPosts } from '../blog-posts/blog-posts.adapter.js';
import { changelogVersionSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/changelog-version/index.js';
import { MuiChangelogVersion } from '../changelog-version/changelog-version.adapter.js';
import { changelogVersionsSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/changelog-versions/index.js';
import { MuiChangelogVersions } from
  '../changelog-versions/changelog-versions.adapter.js';

export const editorialEntries = {
  BlogPost: renderEntry('BlogPost', blogPostSchema, MuiBlogPost),
  BlogPosts: renderEntry('BlogPosts', blogPostsSchema, MuiBlogPosts),
  ChangelogVersion: renderEntry(
    'ChangelogVersion',
    changelogVersionSchema,
    MuiChangelogVersion,
  ),
  ChangelogVersions: renderEntry(
    'ChangelogVersions',
    changelogVersionsSchema,
    MuiChangelogVersions,
  ),
};
