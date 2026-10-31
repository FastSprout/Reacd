import { expect, it } from 'vitest';
import { listboxKeys, orderedListboxSelection } from './selection.js';

const items = [
  { value: '42', label: 'Answer' },
  { value: 'b', label: 'Beta' },
  { value: 'old', label: 'Unavailable', disabled: true },
  { value: 'new', label: 'New unavailable', disabled: true },
] as const;
const single = { label: 'Choice', items, value: '42', onValueChange: () => undefined };
const multiple = { ...single, mode: 'multiple' as const, value: ['old', 'b'] };

it('keeps opaque keys and empty values distinct', () => {
  expect(listboxKeys(single)).toEqual(['42']);
  expect(listboxKeys({ ...single, value: '' })).toEqual([]);
  expect(listboxKeys(multiple)).toBe(multiple.value);
});

it('retains host order and appends additions in catalog order', () => {
  expect(orderedListboxSelection(new Set(['42', 'b', 'old']), multiple)).toEqual([
    'old',
    'b',
    '42',
  ]);
  expect(orderedListboxSelection('all', multiple)).toEqual(['old', 'b', '42']);
  expect(orderedListboxSelection(new Set(), single)).toEqual([]);
  expect(orderedListboxSelection(new Set(['b']), single)).toEqual(['b']);
});

it('rejects unknown/numeric SDK identities and single select-all', () => {
  expect(orderedListboxSelection('all', single)).toBeUndefined();
  expect(orderedListboxSelection(new Set([42]), single)).toBeUndefined();
  expect(orderedListboxSelection(new Set(['missing']), single)).toBeUndefined();
});
