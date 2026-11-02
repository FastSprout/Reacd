import { expect, test } from '@playwright/test';
import { openTemporalProof, unsupportedTemporalProof } from
  '../temporal-proofs.js';

// Exercise the production conformance entry rather than the former private root.
test('private conformance build serves every temporal proof region', async ({
  page,
}) => {
  const { material, failures } = await openTemporalProof(page);
  for (const kind of ['date', 'time']) {
    for (const behavior of ['reset', 'recovery']) {
      await expect(
        page.getByRole('region', { name: `${kind} ${behavior} proof` }),
      ).toHaveCount(1);
    }
  }
  if (material) {
    await unsupportedTemporalProof(page, failures, 'Date range recovery', 'InputDate');
    await unsupportedTemporalProof(page, failures, 'Time range recovery', 'InputTime');
    await unsupportedTemporalProof(page, failures, 'Time recovery', 'InputTime');
    await expect(page.getByRole('region', { name: 'date recovery proof' })
      .getByRole('group', { name: 'date recovery', exact: true })).toBeVisible();
  } else {
    for (const kind of ['date', 'time']) {
      await expect(page.getByRole('region', { name: `${kind} reset proof` })
        .getByRole('spinbutton')).toHaveCount(6);
      await expect(page.getByRole('region', { name: `${kind} recovery proof` })
        .getByRole('spinbutton')).toHaveCount(3);
    }
  }
});
