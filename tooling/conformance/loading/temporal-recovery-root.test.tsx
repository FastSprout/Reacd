import { expect, it } from 'vitest';

it('rejects a temporal proof document without its mount root', async () => {
  await expect(import('../../../test-support/temporal-recovery-browser.js'))
    .rejects.toThrow('Missing temporal recovery fixture root.');
});
