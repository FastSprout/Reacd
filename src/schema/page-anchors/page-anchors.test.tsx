import { createElement } from 'react';
import { describe, expect, it } from 'vitest';
import { pageAnchorsSchema } from './page-anchors.schema.js';
import { pageLinksSchema } from '../page-links/page-links.schema.js';
import { pageSchema } from '../page/page.schema.js';
import { sectionSchema } from '../section/section.schema.js';
import { pageHeaderSchema } from '../page-header/page-header.schema.js';
import { pageSectionSchema } from '../page-section/page-section.schema.js';

describe('semantic page links and anchors', () => {
  it('validates unique targets and an explicit current link', () => {
    for (const schema of [pageAnchorsSchema, pageLinksSchema]) {
      expect(schema.safeParse({ label: 'Related links' }).success).toBe(true);
      expect(
        schema.safeParse({
          label: 'Related links',
          activeKey: 'overview',
          links: [{ key: 'overview', label: 'Overview', href: '#overview' }],
        }).success,
      ).toBe(true);
      for (const value of [
        { activeKey: 'missing' },
        {
          links: [
            { key: 'same', label: 'One', href: '/' },
            { key: 'same', label: 'Two', href: '/' },
          ],
        },
        { links: [{ key: 'bad', label: 'Unsafe', href: 'javascript:alert(1)' }] },
        {
          links: [
            { key: 'bad', label: 'Native', href: '/', leading: createElement('img') },
          ],
        },
        { style: {} },
        { className: 'custom' },
      ])
        expect(schema.safeParse({ label: 'Links', ...value }).success).toBe(false);
    }
  });

  it('bounds semantic heading identities', () => {
    for (const schema of [
      pageSchema,
      sectionSchema,
      pageHeaderSchema,
      pageSectionSchema,
    ]) {
      expect(
        schema.safeParse({ title: 'Title', anchor: 'Section_1-overview' }).success,
      ).toBe(true);
      for (const anchor of ['', '1-start', 'with space', 'bad:attr', 'a'.repeat(81)]) {
        expect(schema.safeParse({ title: 'Title', anchor }).success).toBe(false);
      }
    }
    expect(
      pageSchema.safeParse({ title: 'Page', left: createElement('div') }).success,
    ).toBe(false);
    expect(
      pageSchema.safeParse({ title: 'Page', right: createElement('div') }).success,
    ).toBe(false);
  });
});
