import { createElement } from 'react';
import { describe, expect, it } from 'vitest';
import { pageHeaderSchema } from './page-header.schema.js';
import { pageFeatureSchema } from '../page-feature/page-feature.schema.js';
import { pageHeroSchema } from '../page-hero/page-hero.schema.js';
import { pageSectionSchema } from '../page-section/page-section.schema.js';

describe('closed Page presentation schemas', () => {
  it('accepts safe slots and rejects rendering escapes', () => {
    for (const schema of [
      pageHeaderSchema,
      pageFeatureSchema,
      pageHeroSchema,
      pageSectionSchema,
    ]) {
      expect(schema.safeParse({}).success).toBe(true);
      expect(schema.safeParse({ title: 'Title', description: 'Copy' }).success).toBe(
        true,
      );
      for (const value of [
        { className: 'custom' },
        { style: {} },
        { as: 'div' },
        { children: createElement('div') },
        { title: '' },
      ]) {
        expect(schema.safeParse(value).success).toBe(false);
      }
    }
    for (const value of [
      { href: '/' },
      { onPress: () => undefined },
      { title: 'Ambiguous', href: '/', onPress: () => undefined },
      { title: 'No target', newWindow: true },
    ]) {
      expect(pageFeatureSchema.safeParse(value).success).toBe(false);
    }
    expect(
      pageFeatureSchema.safeParse({ title: 'Plain', newWindow: false }).success,
    ).toBe(true);
    for (const slot of ['links', 'top', 'bottom', 'header', 'footer']) {
      expect(pageHeroSchema.safeParse({ [slot]: createElement('div') }).success).toBe(
        false,
      );
    }
    for (const slot of ['leading', 'features']) {
      expect(
        pageSectionSchema.safeParse({ [slot]: createElement('div') }).success,
      ).toBe(false);
    }
  });
});
