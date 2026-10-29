import { expect, it, vi } from 'vitest';
import { TREE_POLICY } from '../../core/tree-policy.js';
import { contentNavigationSchema } from './content-navigation.schema.js';
import { contentTocSchema } from '../content-toc/content-toc.schema.js';

const items = [
  {
    key: 'guide',
    label: 'Guide',
    children: [{ key: 'intro', label: 'Introduction', href: '#intro' }],
  },
];
const properties = {
  label: 'Documentation',
  items,
  expandedKeys: [],
  onExpandedKeysChange: vi.fn(),
};

it('rejects invalid navigation and native escape hatches', () => {
  expect(contentNavigationSchema.safeParse(properties).success).toBe(true);
  for (const overrides of [
    { onCurrentChange: false },
    { style: {} },
    { currentKey: 'missing' },
    { expandedKeys: ['intro'] },
    { expandedKeys: ['guide', 'guide'] },
    { items: [{ key: 'leaf', label: 'Untargeted' }] },
    { items: [{ key: 'leaf', label: 'Unsafe', href: 'javascript:alert(1)' }] },
    { items: [{ key: 'leaf', label: 'Unknown', href: '/', className: 'x' }] },
    { items: [{ key: 'bad.anchor', label: 'Invalid identifier', href: '/' }] },
    {
      items: [
        {
          key: 'leaf',
          label: 'New window requires href',
          newWindow: true,
          children: [{ key: 'child', label: 'Child', href: '/' }],
        },
      ],
    },
    { items: [...items, { key: 'intro', label: 'Duplicate', href: '/' }] },
    {
      items: Array.from({ length: TREE_POLICY.maxNodes + 1 }, (_, index) => ({
        key: `node${index}`,
        label: 'Node',
        href: '/',
      })),
    },
  ])
    expect(
      contentNavigationSchema.safeParse({ ...properties, ...overrides }).success,
    ).toBe(false);
});

it('bounds cycles and depth before recursive parsing', () => {
  const cycle: unknown[] = [];
  cycle.push({ key: 'cycle', label: 'Cycle', children: cycle });
  expect(
    contentNavigationSchema.safeParse({ ...properties, items: cycle }).success,
  ).toBe(false);
  let deep: unknown = [{ key: 'end', label: 'End', href: '/' }];
  for (let depth = 0; depth <= TREE_POLICY.maxDepth; depth++)
    deep = [{ key: `level${depth}`, label: 'Level', children: deep }];
  expect(
    contentNavigationSchema.safeParse({ ...properties, items: deep }).success,
  ).toBe(false);
});

it('keeps ToC fragments semantic and current state explicit', () => {
  const toc = {
    label: 'On this page',
    items: [
      {
        key: 'overview',
        label: 'Overview',
        children: [{ key: 'details', label: 'Details' }],
      },
    ],
  };
  expect(contentTocSchema.safeParse({ ...toc, currentKey: 'details' }).success).toBe(
    true,
  );
  expect(contentTocSchema.safeParse({ ...toc, currentKey: '' }).success).toBe(true);
  for (const overrides of [
    { currentKey: 'missing' },
    { style: {} },
    { items: [{ key: 'details', label: 'Details', href: '/' }] },
    { items: [{ key: '1bad', label: 'Invalid anchor' }] },
    { items: [{ key: 'x', label: 'One', children: [{ key: 'x', label: 'Two' }] }] },
  ])
    expect(contentTocSchema.safeParse({ ...toc, ...overrides }).success).toBe(false);
});
