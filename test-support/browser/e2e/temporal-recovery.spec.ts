import { expect, test } from '@playwright/test';
import { openTemporalProof, unsupportedTemporalProof } from
  '../temporal-proofs.js';

for (const template of ['saas-modern-light', 'erp-compact']) {
  for (const kind of ['date', 'time']) {
    const initial =
      kind === 'date'
        ? { start: '2024-01-01', end: '2024-01-05' }
        : { start: '09:00:00', end: '10:00:00' };
    const replacement =
      kind === 'date'
        ? { start: '2024-02-01', end: '2024-02-05' }
        : { start: '13:00:00', end: '14:00:00' };

    test(`${template} ${kind} programmatic reset preserves active segment`, async ({
      page,
    }) => {
      const { material, failures } = await openTemporalProof(page, template);
      const region = page.getByRole('region', { name: `${kind} reset proof` });
      if (material) {
        await unsupportedTemporalProof(page, failures,
          kind === 'date' ? 'Date range recovery' : 'Time range recovery',
          kind === 'date' ? 'InputDate' : 'InputTime');
        await expect(region.getByRole('status', { name: 'Range value' }))
          .toHaveText(JSON.stringify(initial));
        await region.getByRole('button', { name: 'Replace', exact: true }).click();
        await expect(region.getByRole('status', { name: 'Range value' }))
          .toHaveText(JSON.stringify(replacement));
        await expect(region.getByRole('status', { name: 'Range writes' }))
          .toHaveText('[]');
        return;
      }
      const part = kind === 'date' ? 'month' : 'hour';
      const segment = region.getByRole('spinbutton', {
        name: new RegExp(`${part}, ${kind} range Start`, 'i'),
      });
      await segment.focus();
      await segment.evaluate((element) => element.closest('form')?.reset());
      await expect(segment).toBeFocused();
      await expect(region.getByRole('status', { name: 'Range writes' })).toHaveText(
        JSON.stringify([initial]),
      );
      await segment.evaluate((element) => {
        const form = element.closest('form');
        form?.reset();
        form?.reset();
      });
      await expect(segment).toBeFocused();
      await expect(region.getByRole('status', { name: 'Range writes' })).toHaveText(
        JSON.stringify([initial, initial, initial]),
      );
    });

    test(`${template} ${kind} atomic native reset and host protection`, async ({
      page,
    }) => {
      const errors: string[] = [];
      page.on('pageerror', (error) => errors.push(error.message));
      const { material, failures } = await openTemporalProof(page, template);
      const region = page.getByRole('region', { name: `${kind} reset proof` });
      if (material) {
        await unsupportedTemporalProof(page, failures,
          kind === 'date' ? 'Date range recovery' : 'Time range recovery',
          kind === 'date' ? 'InputDate' : 'InputTime');
        await expect(region.getByRole('status', { name: 'Range value' }))
          .toHaveText(JSON.stringify(initial));
        await region.getByRole('button', { name: 'Replace', exact: true }).click();
        await expect(region.getByRole('status', { name: 'Range value' }))
          .toHaveText(JSON.stringify(replacement));
        await expect(region.getByRole('status', { name: 'Range writes' }))
          .toHaveText('[]');
        return;
      }
      const writes = region.getByRole('status', { name: 'Range writes' });
      await region.getByRole('button', { name: 'Replace', exact: true }).click();
      await region.getByRole('textbox', { name: `Unrelated ${kind}` }).fill('Edited');
      await region.getByRole('button', { name: 'Reset', exact: true }).focus();
      await page.keyboard.press('Enter');
      await expect(writes).toHaveText(JSON.stringify([initial]));
      await expect(region.getByRole('status', { name: 'Range value' })).toHaveText(
        JSON.stringify(initial),
      );
      await expect(
        region.getByRole('textbox', { name: `Unrelated ${kind}` }),
      ).toHaveValue('Initial');
      await region.getByRole('button', { name: 'Save', exact: true }).click();
      await expect(region.getByRole('status', { name: 'Range saved' })).toHaveText(
        JSON.stringify({
          'range.start': initial.start,
          'range.end': initial.end,
        }),
      );

      await region.getByRole('button', { name: 'Replace', exact: true }).click();
      await region.getByRole('button', { name: 'Toggle decline' }).click();
      await region.getByRole('button', { name: 'Reset', exact: true }).click();
      await expect(writes).toHaveText(JSON.stringify([initial, initial]));
      await expect(region.getByRole('status', { name: 'Range value' })).toHaveText(
        JSON.stringify(replacement),
      );
      await region.getByRole('button', { name: 'Toggle readonly' }).click();
      await region.getByRole('button', { name: 'Reset', exact: true }).click();
      await expect(writes).toHaveText(JSON.stringify([initial, initial]));
      await region.getByRole('button', { name: 'Save', exact: true }).click();
      await expect(region.getByRole('status', { name: 'Range saved' })).toHaveText(
        JSON.stringify({
          'range.start': replacement.start,
          'range.end': replacement.end,
        }),
      );
      await region.getByRole('button', { name: 'Toggle disabled' }).click();
      await region.getByRole('button', { name: 'Reset', exact: true }).click();
      await expect(writes).toHaveText(JSON.stringify([initial, initial]));
      await region.getByRole('button', { name: 'Save', exact: true }).click();
      await expect(region.getByRole('status', { name: 'Range saved' })).toHaveText(
        '{}',
      );
      expect(errors).toEqual([]);
    });

    test(`${template} ${kind} external recovery and same-value draft`, async ({
      page,
    }) => {
      const { material, failures } = await openTemporalProof(page, template);
      const region = page.getByRole('region', { name: `${kind} recovery proof` });
      if (material && kind === 'time') {
        await unsupportedTemporalProof(page, failures, 'Time recovery', 'InputTime');
        await expect(region.getByRole('status', { name: 'Recovery writes' }))
          .toHaveText('0');
        return;
      }
      const segment = material
        ? region.getByRole('group', { name: 'date recovery', exact: true })
          .getByRole('spinbutton', { name: /^month(?:,|$)/i })
        : region.getByRole('spinbutton', {
          name: new RegExp(
            `${kind === 'date' ? 'month' : 'hour'}, ${kind} recovery`, 'i',
          ),
        });
      await segment.focus();
      await page.keyboard.press('ArrowUp');
      await region.getByRole('button', { name: 'Save', exact: true }).click();
      await expect(region.getByRole('status', { name: 'Recovery saved' })).toHaveText(
        '0',
      );
      await region.getByRole('button', { name: 'Replace', exact: true }).click();
      await region.getByRole('button', { name: 'Save', exact: true }).click();
      await expect(region.getByRole('status', { name: 'Recovery saved' })).toHaveText(
        '1',
      );
      await expect(region.getByRole('status', { name: 'Recovery writes' })).toHaveText(
        '0',
      );
      await segment.focus();
      await page.keyboard.press('Backspace');
      await expect(segment).not.toHaveAttribute('aria-valuenow');
      await region.getByRole('button', { name: 'Refresh' }).click();
      await expect(region.getByRole('status', { name: 'Refresh count' })).toHaveText(
        '1',
      );
      await expect(segment).not.toHaveAttribute('aria-valuenow');
      await region.getByRole('button', { name: 'Save', exact: true }).click();
      await expect(region.getByRole('status', { name: 'Recovery saved' })).toHaveText(
        '1',
      );
      await expect(segment).toBeFocused();
    });
  }
}
