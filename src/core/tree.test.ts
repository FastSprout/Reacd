import { expect, it } from 'vitest';
import { treeRows, treeSelection, treeExpansion } from './tree.js';
import { treeFocusTarget, treeTypeahead } from './tree-navigation.js';
import { boundedTree } from './tree-budget.js';
import { TREE_POLICY } from './tree-policy.js';

const items = [
  {
    id: 'folder',
    label: 'Folder',
    children: [
      { id: 'alpha', label: 'Alpha' },
      { id: 'beta', label: 'Beta' },
    ],
  },
  { id: 'gamma', label: 'Gamma', disabled: true },
];
it('derives visible hierarchy and controlled state transitions', () => {
  expect(treeRows(items, []).map((row) => row.id)).toEqual(['folder', 'gamma']);
  expect(treeRows(items).map((row) => row.id)).toEqual([
    'folder',
    'alpha',
    'beta',
    'gamma',
  ]);
  const child = treeRows(items, ['folder'])[1];
  expect(child).toMatchObject({ parent: 'folder', level: 2, position: 1, size: 2 });
  expect(treeSelection([], 'alpha', false)).toEqual(['alpha']);
  expect(treeSelection(['alpha'], 'beta', true)).toEqual(['alpha', 'beta']);
  expect(treeSelection(['alpha', 'beta'], 'alpha', true)).toEqual(['beta']);
  expect(treeExpansion([], 'folder')).toEqual(['folder']);
  expect(treeExpansion(['folder'], 'folder')).toEqual([]);
});
it('moves within enabled visible content and finds labels by prefix', () => {
  const rows = treeRows(items, ['folder']);
  for (const [key, id] of [
    ['ArrowDown', 'alpha'],
    ['ArrowUp', 'folder'],
    ['Home', 'folder'],
    ['End', 'beta'],
  ] as const)
    expect(treeFocusTarget(rows, 'folder', key)).toBe(id);
  expect(treeFocusTarget(rows, 'unknown', 'ArrowDown')).toBe('alpha');
  expect(treeFocusTarget(rows, 'beta', 'ArrowDown')).toBe('beta');
  expect(treeFocusTarget(rows, 'folder', 'Tab')).toBeUndefined();
  expect(treeFocusTarget([], undefined, 'Home')).toBeUndefined();
  expect(treeTypeahead(rows, 'folder', 'be')).toBe('beta');
  expect(treeTypeahead(rows, 'beta', 'fo')).toBe('folder');
  expect(treeTypeahead(rows, undefined, 'missing')).toBeUndefined();
});
it('rejects cyclic or unbounded hierarchy before recursive parsing', () => {
  expect(boundedTree(items)).toBe(true);
  expect(boundedTree('not an array')).toBe(true);
  expect(boundedTree([{ id: 'a', disabled: undefined }])).toBe(true);
  const cycle: { children?: unknown } = {};
  cycle.children = [cycle];
  expect(boundedTree([cycle])).toBe(false);
  expect(boundedTree(Array.from({ length: 201 }, () => ({})))).toBe(false);
  let nested: unknown = [{ id: 'leaf' }];
  for (let depth = 0; depth < 17; depth += 1) nested = [{ children: nested }];
  expect(boundedTree(nested)).toBe(false);
  expect(boundedTree([null, 1, { children: 'invalid' }])).toBe(true);
});

it('rejects oversized arrays before reading or queuing their elements', () => {
  const oversized = Array.from({ length: TREE_POLICY.maxNodes + 1 });
  Object.defineProperty(oversized, 0, {
    get() {
      throw new Error('Oversized arrays must be rejected before element access.');
    },
  });
  expect(boundedTree(oversized)).toBe(false);
  expect(boundedTree([{ children: oversized }])).toBe(false);
});

it('rejects array-only nesting and bounds each pending sibling collection', () => {
  let arrays: unknown = [];
  for (let depth = 0; depth <= TREE_POLICY.maxDepth; depth += 1) arrays = [arrays];
  expect(boundedTree(arrays)).toBe(false);
  expect(boundedTree([[]])).toBe(false);
  const children = Array.from({ length: TREE_POLICY.maxNodes }, () => ({}));
  expect(boundedTree([{ children }])).toBe(false);
  expect(boundedTree(children)).toBe(true);
  const shared: unknown[] = [];
  expect(boundedTree([{ children: shared }, { children: shared }])).toBe(false);
});
