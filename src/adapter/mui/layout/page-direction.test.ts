import { expect, it } from 'vitest';
import { materialPageDirection } from './page-direction.js';
it.each([
  ['vertical', 'column'],
  ['horizontal', 'row'],
] as const)('maps %s to native Stack direction', (orientation, direction) => {
  expect(materialPageDirection({ orientation })).toBe(direction);
});
it('uses the named default page orientation', () => {
  expect(materialPageDirection({})).toBe('column');
});
