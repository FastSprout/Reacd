import { expect, test } from '@playwright/test';
import { CHAT_LOADING_DOCUMENT } from '../../chat-loading-document.js';

const VIEWPORT = { width: 240, height: 1000 };
const TOLERANCE = 1;

for (const profile of ['Spacious', 'Compact']) {
  test(`${profile} composed chat loading announcements at 240px RTL 200%`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.setViewportSize(VIEWPORT);
    await page.goto('/');
    await page.getByRole('combobox', { name: 'Appearance', exact: true }).click();
    await page.getByRole('option', { name: profile, exact: true }).click();
    await page.getByRole('tab', { name: 'Generative UI', exact: true }).click();
    const preview = page.getByRole('region', { name: 'Generative UI', exact: true });
    await preview
      .getByRole('textbox', { name: 'JSON declaration' })
      .fill(JSON.stringify(CHAT_LOADING_DOCUMENT));
    await preview
      .getByRole('button', { name: 'Render declaration', exact: true })
      .click();
    await page.evaluate(() => {
      document.documentElement.style.fontSize = '200%';
    });
    const log = preview.getByRole('log', { name: 'Review transcript' });
    await expect(log).toHaveAttribute('aria-busy', 'true');
    await expect(log).toHaveCSS('direction', 'rtl');
    await expect(log.getByRole('status')).toHaveCount(0);
    await expect(log.getByText('Uploading', { exact: true })).toBeVisible();
    await expect(log.getByText('Receiving response.', { exact: true })).toBeVisible();
    const form = preview.getByRole('form', { name: 'Review composer' });
    const draft = form.getByRole('textbox', { name: 'Review composer' });
    await expect(draft).toHaveValue('Preserved draft');
    expect(
      await draft.evaluate((element) => element.closest('[aria-busy="true"]') !== null),
    ).toBe(true);
    await expect(form.getByText('Uploading', { exact: true })).toBeVisible();
    await expect(form.getByRole('status')).toHaveCount(2);
    const statuses = preview.getByRole('status');
    await expect(statuses).toHaveCount(7);
    expect(
      await statuses.evaluateAll((elements) =>
        elements.every((element) => element.closest('[aria-busy="true"]') === null),
      ),
    ).toBe(true);
    for (const name of ['Review summary', 'Review tool']) {
      const trigger = preview.getByRole('button', { name, exact: true });
      await expect(trigger).toHaveAccessibleName(name);
      const target = await trigger.getAttribute('aria-controls');
      if (target === null) throw new Error('Missing controlled feedback region.');
      await expect(page.locator(`[id="${target}"]`)).toHaveAttribute(
        'aria-busy',
        'true',
      );
    }
    await form.getByRole('button', { name: 'Stop response', exact: true }).click();
    await expect(
      preview.getByText('Saved locally: Scope proof', { exact: true }),
    ).toBeVisible();
    await expect(draft).toHaveValue('Preserved draft');
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(VIEWPORT.width + TOLERANCE);
    expect(errors).toEqual([]);
  });
}
