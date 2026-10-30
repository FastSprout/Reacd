import { expect, test } from '@playwright/test';

// The full suite uses this production entry, not the former private Vite root.
test('private conformance build serves every temporal proof region', async ({
  page,
}) => {
  await page.goto('/temporal-recovery.html');
  for (const kind of ['date', 'time']) {
    for (const behavior of ['reset', 'recovery']) {
      await expect(
        page.getByRole('region', { name: `${kind} ${behavior} proof` }),
      ).toHaveCount(1);
    }
  }
});
