import { expect, it } from 'vitest';
import { filterFormMenuItems } from './form-menu-search.js';

const items = [
  { value: 'a', label: 'Kraków', description: 'Poland' },
  { value: 'b', label: 'Paris' },
];

it('matches folded terms in stable order without interpreting keys', () => {
  expect(filterFormMenuItems(items, 'KRAKOW poland')).toEqual([items[0]]);
  expect(filterFormMenuItems(items, '')).toEqual(items);
  expect(filterFormMenuItems(items, 'missing')).toEqual([]);
  expect(filterFormMenuItems(items, 'a')).toEqual(items);
});

it('uses only ordered external results and safely ignores absent private keys', () => {
  expect(filterFormMenuItems(items, 'no match', ['b', 'a'])).toEqual([
    items[1],
    items[0],
  ]);
  expect(filterFormMenuItems(items, '', ['missing'])).toEqual([]);
  expect(filterFormMenuItems(items, '', [])).toEqual([]);
});
