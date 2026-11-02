import { expect, it } from 'vitest';
import { materialDescriptionIds } from './description-ids.js';
it('references rendered helpers and inherited descriptions', () => {
  expect(materialDescriptionIds([], 'local')).toBeUndefined();
  expect(materialDescriptionIds(['external'], 'local')).toBe('external');
  expect(materialDescriptionIds(['external'], 'local', 'Help')).toBe('external local');
});
