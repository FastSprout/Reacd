import { beforeAll, expect, it } from 'vitest';
import { loadMaterialAdapter } from './material-adapter.js';
import { NATIVE_MODULE_IMPORT_TIMEOUT_MS } from
  '../../../test-support/native-module-policy.js';

beforeAll(async () => {
  await import('@fastsprout/reacd-mui');
}, NATIVE_MODULE_IMPORT_TIMEOUT_MS);

it('loads the explicit alternate SDK once and shares its pending module', async () => {
  const first = loadMaterialAdapter();
  expect(loadMaterialAdapter()).toBe(first);
  expect((await first).id).toBe('material-ui');
});
