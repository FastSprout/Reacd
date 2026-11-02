import { expect, it } from 'vitest';
import { loadMaterialAdapter } from './material-adapter.js';

it('loads the explicit alternate SDK once and shares its pending module', async () => {
  const first = loadMaterialAdapter();
  expect(loadMaterialAdapter()).toBe(first);
  expect((await first).id).toBe('material-ui');
});
