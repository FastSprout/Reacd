import { describe, expect, it } from 'vitest';
import { STATE_POLICY } from '../../core/state-policy.js';
import { stateDefinitionsSchema } from './definitions.schema.js';

const definitions = [
  { key: 'customer.name', kind: 'text', initial: '', access: 'readWrite' },
  { key: 'amount', kind: 'number', initial: 42, access: 'readWrite' },
  { key: 'enabled', kind: 'boolean', initial: false, access: 'readWrite' },
  {
    key: 'rows',
    kind: 'tableRows',
    initial: [
      { id: 'row-1', cells: { name: 'Example', amount: 42, ready: true, note: null } },
    ],
    access: 'read',
  },
  { key: 'selected', kind: 'selection', initial: ['row-1'], access: 'readWrite' },
  {
    key: 'sort',
    kind: 'sorting',
    initial: [{ column: 'name', direction: 'ascending' }],
    access: 'readWrite',
  },
  {
    key: 'filter',
    kind: 'filters',
    initial: [
      { column: 'name', operator: 'contains', value: 'Example' },
      { column: 'amount', operator: 'greaterThan', value: 1 },
      { column: 'amount', operator: 'lessThan', value: 100 },
      { column: 'ready', operator: 'equals', value: true },
    ],
    access: 'readWrite',
  },
  {
    key: 'page',
    kind: 'pagination',
    initial: { pageIndex: 0, pageSize: 25 },
    access: 'readWrite',
  },
];

describe('generative state definitions', () => {
  it('validates every state kind with typed, immutable initial values', () => {
    const parsed = stateDefinitionsSchema.parse(definitions);
    expect(parsed).toEqual(definitions);
    expect(Object.isFrozen(parsed)).toBe(true);
    for (const definition of parsed) {
      expect(Object.isFrozen(definition)).toBe(true);
      if (definition.kind === 'tableRows') {
        expect(Object.isFrozen(definition.initial)).toBe(true);
        for (const row of definition.initial) {
          expect(Object.isFrozen(row)).toBe(true);
          expect(Object.isFrozen(row.cells)).toBe(true);
        }
      }
    }
  });

  it('accepts empty registries and rejects duplicate keys', () => {
    expect(stateDefinitionsSchema.parse([])).toEqual([]);
    expect(
      stateDefinitionsSchema.safeParse([definitions[0], definitions[0]]).success,
    ).toBe(false);
  });

  it.each([
    { kind: 'number', initial: Infinity },
    { kind: 'number', initial: '42' },
    { kind: 'boolean', initial: 'true' },
    { kind: 'text', initial: {} },
    { kind: 'selection', initial: ['same', 'same'] },
    {
      kind: 'tableRows',
      initial: [
        { id: 'same', cells: {} },
        { id: 'same', cells: {} },
      ],
    },
    { kind: 'tableRows', initial: [{ id: 'row', cells: { nested: {} } }] },
    {
      kind: 'tableRows',
      initial: [
        {
          id: 'row',
          cells: Object.fromEntries(
            Array.from({ length: STATE_POLICY.maxColumns + 1 }, (_, i) => [`c${i}`, i]),
          ),
        },
      ],
    },
    {
      kind: 'sorting',
      initial: [
        { column: 'name', direction: 'ascending' },
        { column: 'name', direction: 'descending' },
      ],
    },
    { kind: 'filters', initial: [{ column: 'name', operator: 'contains', value: 42 }] },
    {
      kind: 'filters',
      initial: [{ column: 'amount', operator: 'greaterThan', value: 'one' }],
    },
    {
      kind: 'filters',
      initial: [
        { column: 'name', operator: 'equals', value: 'x' },
        { column: 'name', operator: 'equals', value: 'y' },
      ],
    },
    { kind: 'pagination', initial: { pageIndex: -1, pageSize: 25 } },
    { kind: 'pagination', initial: { pageIndex: 0, pageSize: 0 } },
    {
      kind: 'pagination',
      initial: {
        pageIndex: 0,
        pageSize: STATE_POLICY.maxPageSize + 1,
      },
    },
  ])('rejects invalid initial state: %o', (definition) => {
    expect(
      stateDefinitionsSchema.safeParse([
        { key: 'example', access: 'readWrite', ...definition },
      ]).success,
    ).toBe(false);
  });
});
