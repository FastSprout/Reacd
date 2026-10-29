import { readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';
import {
  bundleEntry,
  bundleManifestSchema,
} from '../../tooling/build/bundle-manifest.js';

const input: unknown = JSON.parse(
  readFileSync('demo-dist/.vite/manifest.json', 'utf8'),
);
const manifest = bundleManifestSchema.parse(input);
const FILES = {
  fields: bundleEntry(manifest, 'catalog/field-examples.tsx').file,
  data: bundleEntry(manifest, 'catalog/data-examples.tsx').file,
  actions: bundleEntry(manifest, 'catalog/action-examples.tsx').file,
  navigation: bundleEntry(manifest, 'catalog/navigation-examples.tsx').file,
  playground: bundleEntry(manifest, 'generative/playground.tsx').file,
};
async function select(page: Page, name: string, option: string) {
  const trigger = page.getByRole('combobox', { name, exact: true });
  await trigger.click();
  await page.getByRole('option', { name: option, exact: true }).click();
  await expect(trigger).toBeFocused();
}
for (const profile of ['Spacious', 'Compact']) {
  test(`${profile} defers views and preserves state`, async ({ page }) => {
    const requested: string[] = [];
    page.on('request', (request) => requested.push(new URL(request.url()).pathname));
    let release: () => void = () => undefined;
    const gate = new Promise<void>((resolve) => {
      release = resolve;
    });
    await page.route(`**/${FILES.fields}`, async (route) => {
      await gate;
      await route.continue();
    });
    try {
      await page.goto('/');
      await select(page, 'Appearance', profile);
      await expect(
        page.getByRole('heading', { name: 'Layout primitives', exact: true }),
      ).toBeVisible();
      for (const file of Object.values(FILES))
        expect(requested).not.toContain(`/${file}`);
      const fieldRequest = page.waitForRequest(
        (request) => new URL(request.url()).pathname === `/${FILES.fields}`,
      );
      await page.getByRole('button', { name: 'Fields', exact: true }).click();
      await fieldRequest;
      await expect(
        page.getByRole('status', { name: 'Loading Fields', exact: true }),
      ).toBeVisible();
      await select(page, 'Appearance', profile === 'Spacious' ? 'Compact' : 'Spacious');
      release();
      const name = page.getByLabel('Name', { exact: true });
      await name.fill('Retained lazy field');
      await page.getByRole('button', { name: 'Layout', exact: true }).click();
      await page.getByRole('button', { name: 'Fields', exact: true }).click();
      await expect(name).toHaveValue('Retained lazy field');
      expect(requested.filter((path) => path === `/${FILES.fields}`)).toHaveLength(1);
      await page.getByRole('tab', { name: 'Generative UI', exact: true }).click();
      const note = page.getByLabel('Example note', { exact: true });
      await note.fill('Retained lazy note');
      const source = await page
        .getByLabel('JSON declaration', { exact: true })
        .inputValue();
      await page.getByRole('tab', { name: 'Components', exact: true }).click();
      await expect(name).toHaveValue('Retained lazy field');
      await page.getByRole('tab', { name: 'Generative UI', exact: true }).click();
      await expect(note).toHaveValue('Retained lazy note');
      await expect(page.getByLabel('JSON declaration', { exact: true })).toHaveValue(
        source,
      );
      expect(requested.filter((path) => path === `/${FILES.playground}`)).toHaveLength(
        1,
      );
      expect(requested).not.toContain(`/${FILES.data}`);
      expect(requested).not.toContain(`/${FILES.actions}`);
    } finally {
      release();
    }
  });
  test(`${profile} isolates a failed view and recovers on explicit reload`, async ({
    page,
  }) => {
    await page.route(`**/${FILES.data}`, (route) => route.abort('failed'), {
      times: 1,
    });
    await page.goto('/');
    await select(page, 'Appearance', profile);
    await page.getByRole('button', { name: 'Fields', exact: true }).click();
    await page.getByLabel('Name', { exact: true }).fill('Unsaved before reload');
    await page.getByRole('button', { name: 'Content and data', exact: true }).click();
    await expect(page.getByRole('alert')).toContainText('Cannot load Content and data');
    await expect(page.getByRole('alert')).toContainText('unsaved local changes');
    await page.getByRole('button', { name: 'Fields', exact: true }).click();
    await expect(page.getByLabel('Name', { exact: true })).toHaveValue(
      'Unsaved before reload',
    );
    await page.getByRole('button', { name: 'Content and data', exact: true }).click();
    const reload = page.getByRole('link', { name: 'Reload workspace', exact: true });
    await expect(reload).toHaveAttribute('href', '/');
    await Promise.all([page.waitForEvent('load'), reload.click()]);
    await page.getByRole('button', { name: 'Content and data', exact: true }).click();
    await expect(
      page.getByRole('heading', { name: 'Empty state preview', exact: true }),
    ).toBeVisible();
    await page.getByRole('button', { name: 'Fields', exact: true }).click();
    await expect(page.getByLabel('Name', { exact: true })).toHaveValue('');
  });
}
