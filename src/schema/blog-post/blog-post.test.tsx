import { createElement } from 'react';
import { describe, expect, it } from 'vitest';
import { blogPostSchema } from './blog-post.schema.js';
import { changelogVersionSchema }
  from '../changelog-version/changelog-version.schema.js';
import { blogPostsSchema } from '../blog-posts/blog-posts.schema.js';
import { changelogVersionsSchema }
  from '../changelog-versions/changelog-versions.schema.js';

describe('closed editorial declarations', () => {
  it('validates calendar metadata, named targets and safe content', () => {
    for (const schema of [blogPostSchema, changelogVersionSchema]) {
      expect(schema.safeParse({}).success).toBe(true);
      expect(
        schema.safeParse({
          title: 'Example',
          date: '2024-02-29',
          dateLabel: 'Leap day',
          href: '/',
          image: { src: '/example.png', alt: 'Illustrative example image' },
        }).success,
      ).toBe(true);
      for (const value of [
        { date: '2025-02-29' },
        { date: '2024-13-01' },
        { dateLabel: 'No date' },
        { title: 'Ambiguous', href: '/', onPress: () => undefined },
        { href: '/' },
        { onPress: () => undefined },
        { image: { src: 'data:image/svg+xml,unsafe', alt: 'Unsafe' } },
        { image: { src: '/example.png' } },
        { children: createElement('article') },
        { style: {} },
        { as: 'div' },
      ])
        expect(schema.safeParse(value).success).toBe(false);
    }
  });

  it('rejects duplicate collection identities and native entry content', () => {
    expect(
      blogPostsSchema.safeParse({
        posts: [{ key: 'one', title: 'Example' }],
        orientation: 'vertical',
      }).success,
    ).toBe(true);
    expect(
      changelogVersionsSchema.safeParse({
        versions: [{ key: 'one', title: 'Example', indicator: false }],
      }).success,
    ).toBe(true);
    expect(
      blogPostsSchema.safeParse({ posts: [{ key: 'same' }, { key: 'same' }] }).success,
    ).toBe(false);
    expect(
      changelogVersionsSchema.safeParse({
        versions: [{ key: 'same' }, { key: 'same' }],
      }).success,
    ).toBe(false);
    expect(
      blogPostsSchema.safeParse({
        posts: [{ key: 'one', footer: createElement('button') }],
      }).success,
    ).toBe(false);
  });
});
