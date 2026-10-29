import { expect, test } from '@playwright/test';

for (const profile of ['Spacious', 'Compact']) {
  for (const mode of ['single', 'range']) {
    test(`${profile} ${mode} temporal fields inherit disabled scope`, async ({
      page,
    }) => {
      const errors: string[] = [];
      page.on('pageerror', (error) => errors.push(error.message));
      await page.setViewportSize({ width: 360, height: 1000 });
      await page.goto('/');
      await page.getByRole('combobox', { name: 'Appearance', exact: true }).click();
      await page.getByRole('option', { name: profile, exact: true }).click();
      await page.getByRole('tab', { name: 'Generative UI', exact: true }).click();
      const date =
        mode === 'single' ? '2026-10-14' : { start: '2026-10-14', end: '2026-10-20' };
      const time =
        mode === 'single' ? '12:30:00' : { start: '12:30:00', end: '14:00:00' };
      const declaration = {
        schemaVersion: '0.2',
        state: [
          {
            key: 'date',
            kind: mode === 'single' ? 'date' : 'dateRange',
            initial: date,
            access: 'readWrite',
          },
          {
            key: 'time',
            kind: mode === 'single' ? 'time' : 'timeRange',
            initial: time,
            access: 'readWrite',
          },
        ],
        root: {
          type: 'Form',
          label: 'Scoped temporal form',
          submitAction: 'saveExample',
          children: [
            {
              type: 'FormField',
              name: 'schedule',
              label: 'Disabled schedule',
              disabled: true,
              required: true,
              description: 'Scope guidance',
              error: 'Scope review',
              children: [
                {
                  type: 'InputDate',
                  label: 'Protected date',
                  mode,
                  referenceDate: '2026-10-14',
                  name: 'date',
                  disabled: false,
                  description: 'Date guidance',
                  value: { state: 'date', mode: 'readWrite' },
                },
                {
                  type: 'InputTime',
                  label: 'Protected time',
                  mode,
                  disabled: false,
                  name: 'time',
                  description: 'Time guidance',
                  value: { state: 'time', mode: 'readWrite' },
                },
              ],
            },
          ],
        },
      };
      await page
        .getByRole('textbox', { name: 'JSON declaration' })
        .fill(JSON.stringify(declaration));
      await page.getByRole('button', { name: 'Render declaration' }).click();
      const form = page.getByRole('form', { name: 'Scoped temporal form' });
      const scope = form.getByRole('group', {
        name: 'Disabled schedule *',
        exact: true,
      });
      const segments = scope.getByRole('spinbutton');
      await expect(segments).toHaveCount(mode === 'single' ? 6 : 12);
      for (const segment of await segments.all()) {
        await expect(segment).toHaveAttribute('aria-disabled', 'true');
        await expect(segment).not.toHaveAttribute('contenteditable', 'true');
        await expect(segment).toHaveAttribute('aria-invalid', 'true');
        await expect(segment).toHaveAccessibleDescription(/Scope guidance/);
        await expect(segment).toHaveAccessibleDescription(/Scope review/);
      }
      await expect(form.getByText('Scope review', { exact: true })).toHaveCount(1);
      const before = await form
        .locator('input[type="hidden"][name]')
        .evaluateAll((items) => items.map((item) => item.getAttribute('value')));
      await page.getByRole('button', { name: 'Render declaration' }).focus();
      await page.keyboard.press('Tab');
      await page.keyboard.press('ArrowUp');
      expect(
        await segments.evaluateAll((items) =>
          items.some((item) => item === item.ownerDocument.activeElement),
        ),
      ).toBe(false);
      expect(
        await form
          .locator('input[type="hidden"][name]')
          .evaluateAll((items) => items.map((item) => item.getAttribute('value'))),
      ).toEqual(before);
      expect(await form.evaluate((element) => {
        if (!(element instanceof HTMLFormElement)) throw new Error('Expected form.');
        return [...new FormData(element)];
      })).toEqual([]);
      expect(errors).toEqual([]);
    });
  }
}
