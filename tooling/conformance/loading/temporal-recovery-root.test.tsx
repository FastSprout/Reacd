import { beforeAll, expect, it } from 'vitest';
import { NATIVE_MODULE_IMPORT_TIMEOUT_MS } from
  '../../../test-support/native-module-policy.js';

beforeAll(async () => {
  await import('../../../test-support/browser/adapter.js');
  await import('../../../src/index.js');
}, NATIVE_MODULE_IMPORT_TIMEOUT_MS);

it('rejects a temporal proof document without its mount root', async () => {
  await expect(
    import('../../../test-support/temporal-recovery-browser.js'),
  ).rejects.toThrow('Missing temporal recovery fixture root.');
});
