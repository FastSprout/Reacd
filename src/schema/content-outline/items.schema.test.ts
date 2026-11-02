import { expect, it } from 'vitest';
import { contentNavigationItemsSchema, contentTocItemsSchema } from './items.schema.js';

it('retains content anchors while preserving semantic navigation IDs', () => {
  const items = [
    { key: '030-2026-10-31', label: '0.3.0' },
    { key: 'zażółć', label: 'Unicode heading' },
  ];
  expect(contentTocItemsSchema.parse(items)).toEqual(items);
  expect(
    contentNavigationItemsSchema.safeParse(
      items.map((item) => ({
        ...item,
        href: '/changelog/',
      })),
    ).success,
  ).toBe(false);
  for (const key of ['contains spaces', 'unsafe#fragment', 'unsafe/path']) {
    expect(contentTocItemsSchema.safeParse([{ key, label: 'Invalid' }]).success).toBe(
      false,
    );
  }
});

it('requires a destination when navigation opens a new window', () => {
  const destination = {
    key: 'external-guide',
    label: 'External guide',
    href: 'https://example.com/guide',
    newWindow: true,
  };
  expect(contentNavigationItemsSchema.parse([destination])).toEqual([destination]);
  expect(
    contentNavigationItemsSchema.safeParse([
      {
        key: 'guide-group',
        label: 'Guides',
        newWindow: true,
        children: [{ key: 'guide', label: 'Guide', href: '/guide/' }],
      },
    ]).success,
  ).toBe(false);
  expect(
    contentNavigationItemsSchema.safeParse([{ key: 'empty', label: 'Empty' }])
      .success,
  ).toBe(false);
});
