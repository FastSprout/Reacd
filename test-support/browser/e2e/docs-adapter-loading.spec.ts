import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { expect, test } from '@playwright/test';
import { z } from 'zod';
import { SITE_POLICY } from '../../../tooling/site/policy.js';

const ORIGIN = process.env['REACD_SITE_ORIGIN'] ?? 'http://127.0.0.1:4175';
const RUNTIME_DIRECTORY = process.env['REACD_SITE_RUNTIME_DIRECTORY']
  ?? SITE_POLICY.runtimeDirectory;

const moduleSchema = z.record(z.string(), z.array(z.string()));
const materialModule = /(?:[\\/]adapter[\\/]mui[\\/]|[\\/](?:@mui|@emotion)[\\/])/;

test('loads native Material UI only after selection and retains example state', async ({
  page,
}) => {
  const value: unknown = JSON.parse(
    await readFile(join(RUNTIME_DIRECTORY, 'runtime-modules.json'), 'utf8'),
  );
  const modules = moduleSchema.parse(value);
  const sdk = new Set(
    Object.entries(modules)
      .filter(([, ids]) => ids.some((id) => materialModule.test(id)))
      .map(([file]) => `/${file}`),
  );
  expect(sdk.size).toBeGreaterThan(0);
  const requests: string[] = [];
  const errors: string[] = [];
  page.on('request', (request) => {
    requests.push(new URL(request.url()).pathname);
  });
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto(`${ORIGIN}/components/button/`);
  const action = page.getByRole('button', { name: 'Request export' });
  await action.click();
  await expect(page.getByText('Export requests: 1')).toBeVisible();
  expect(requests.filter((file) => sdk.has(file))).toEqual([]);
  await page.getByRole('combobox', { name: 'Example adapter' }).click();
  await page.getByRole('option', { name: 'Material UI', exact: true }).click();
  await expect(action).toHaveClass(/MuiButton-root/);
  await expect(page.getByText('Export requests: 1')).toBeVisible();
  expect(requests.some((file) => sdk.has(file))).toBe(true);
  await page.getByRole('combobox', { name: 'Example adapter' }).click();
  await page.getByRole('option', { name: 'shadcn/ui', exact: true }).click();
  await expect(action).not.toHaveClass(/MuiButton-root/);
  await expect(page.getByText('Export requests: 1')).toBeVisible();
  expect(errors).toEqual([]);
});
