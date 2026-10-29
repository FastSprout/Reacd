import { expect, it } from 'vitest';
import { treeSchema } from './tree.schema.js';

const items = [
  {
    id: 'folder',
    label: 'Folder',
    children: [
      { id: 'alpha', label: 'Alpha' },
      { id: 'beta', label: 'Beta' },
    ],
  },
];
const valid = {
  label: 'Files',
  items,
  value: [],
  expanded: [],
  onValueChange: () => undefined,
  onExpandedChange: () => undefined,
};
it('accepts bounded empty, single and multiple controlled trees', () => {
  expect(treeSchema.safeParse(valid).success).toBe(true);
  expect(treeSchema.safeParse({ ...valid, items: [] }).success).toBe(true);
  expect(
    treeSchema.safeParse({ ...valid, value: ['alpha'], expanded: ['folder'] }).success,
  ).toBe(true);
  expect(
    treeSchema.safeParse({ ...valid, multiple: true, value: ['alpha', 'beta'] })
      .success,
  ).toBe(true);
});
it('rejects identity, selection, expansion and rendering escape failures', () => {
  for (const change of [
    { label: '' },
    { items: [{ id: '', label: 'Invalid' }] },
    { items: [...items, { id: 'alpha', label: 'Duplicate' }] },
    { items: [{ id: 'empty', label: 'Empty', children: [] }] },
    { value: ['unknown'] },
    { value: ['alpha', 'alpha'] },
    { value: ['alpha', 'beta'] },
    { expanded: ['alpha'] },
    { expanded: ['folder', 'folder'] },
    { onValueChange: 'select' },
    { style: {} },
    { className: 'tree' },
    { onClick: () => undefined },
  ])
    expect(treeSchema.safeParse({ ...valid, ...change }).success).toBe(false);
  const cycle: { children?: unknown } = {};
  cycle.children = [cycle];
  expect(treeSchema.safeParse({ ...valid, items: [cycle] }).success).toBe(false);
});
