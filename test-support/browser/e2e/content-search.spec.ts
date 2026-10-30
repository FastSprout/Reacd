import { expect, test } from '@playwright/test';

const WIDTHS = [240, 320, 768, 1440];
const PROFILES = ['Spacious', 'Compact'];
const DIRECTIONS = ['ltr', 'rtl'];
const HEIGHT = 640;
const TOLERANCE = 1;
const LONG_QUERY = 'unbroken_document_query_'.repeat(20);

for (const profile of PROFILES) {
  for (const width of WIDTHS) {
    for (const direction of DIRECTIONS) {
      test(`${profile} documentation search ${width}px ${direction}`, async ({
        page,
      }) => {
        await page.setViewportSize({ width, height: HEIGHT });
        await page.goto('/');
        await page.getByRole('combobox', { name: 'Appearance', exact: true }).click();
        await page.getByRole('option', { name: profile, exact: true }).click();
        await page.getByRole('button', { name: 'Navigation', exact: true }).click();
        if (direction === 'rtl')
          await page.getByRole('switch', { name: 'Right to left navigation' }).check();
        await page.evaluate(() => {
          document.documentElement.style.fontSize = '200%';
        });
        const trigger = page.getByRole('button', {
          name: 'Open documentation search',
          exact: true,
        });
        await expect(
          page.getByRole('button', {
            name: 'Unavailable documentation search',
            exact: true,
          }),
        ).toBeDisabled();
        await trigger.focus();
        await page.keyboard.press('Enter');
        const dialog = page.getByRole('dialog', { name: 'Documentation search' });
        await expect(dialog).toBeVisible();
        await expect(dialog).toHaveCSS('direction', direction);
        const query = dialog.getByRole('combobox', { name: 'Find documentation' });
        await expect(query).toBeFocused();
        await query.fill('engine');
        const command = dialog.getByRole('option', {
          name: 'Inspect architecture reference',
          exact: true,
        });
        await dialog
          .getByRole('switch', {
            name: 'Veto documentation selection',
          })
          .check();
        await command.click();
        await expect(dialog).toBeVisible();
        await dialog
          .getByRole('switch', {
            name: 'Veto documentation selection',
          })
          .uncheck();
        for (const status of ['Loading', 'Error', 'Ready']) {
          await dialog
            .getByRole('combobox', {
              name: 'Documentation result status',
            })
            .click();
          await page.getByRole('option', { name: status, exact: true }).click();
          await expect(dialog).toBeVisible();
          if (status === 'Error')
            await expect(dialog.getByRole('alert')).toHaveText(
              'Commands could not be loaded.',
            );
        }
        await query.fill(LONG_QUERY);
        await expect(dialog.getByRole('status')).toHaveText(
          'No matching documentation.',
        );
        if (profile === 'Compact' && width === 320 && direction === 'rtl')
          await page.screenshot({ path: '.cache/content-search-compact-rtl.png' });
        const bounds = await dialog.boundingBox();
        expect(bounds).not.toBeNull();
        if (bounds === null) throw new Error('Expected visible search bounds.');
        expect(bounds.x).toBeGreaterThanOrEqual(-TOLERANCE);
        expect(bounds.x + bounds.width).toBeLessThanOrEqual(width + TOLERANCE);
        expect(bounds.y).toBeGreaterThanOrEqual(-TOLERANCE);
        expect(bounds.y + bounds.height).toBeLessThanOrEqual(HEIGHT + TOLERANCE);
        await query.fill('engine');
        await query.press('ArrowDown');
        await query.press('Enter');
        await expect(dialog).toBeHidden();
        await expect(trigger).toBeFocused();
        await expect(page.getByText('Architecture reference inspected.')).toBeVisible();
        await trigger.press('Space');
        await expect(query).toHaveValue('engine');
        await query.press('Escape');
        await expect(dialog).toBeHidden();
        expect(
          await page.evaluate(() => document.documentElement.scrollWidth),
        ).toBeLessThanOrEqual(width + TOLERANCE);
      });
    }
  }
}

test('documentation search defers activation during native IME composition', async ({
  page,
}) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Navigation', exact: true }).click();
  await page.getByRole('button', { name: 'Open documentation search' }).click();
  const dialog = page.getByRole('dialog', { name: 'Documentation search' });
  const query = dialog.getByRole('combobox', { name: 'Find documentation' });
  await query.fill('engine');
  const client = await page.context().newCDPSession(page);
  await client.send('Input.imeSetComposition', {
    text: 'engine',
    selectionStart: 6,
    selectionEnd: 6,
  });
  await page.keyboard.press('Enter');
  await expect(dialog).toBeVisible();
  await client.send('Input.insertText', { text: 'engine' });
  await query.fill('engine');
  await query.press('ArrowDown');
  await query.press('Enter');
  await expect(dialog).toBeHidden();
  await expect(page.getByText('Architecture reference inspected.')).toBeVisible();
});
