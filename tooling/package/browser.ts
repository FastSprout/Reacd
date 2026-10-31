import assert from 'node:assert/strict';
import { chromium, expect } from '@playwright/test';
import { preview } from 'vite';

const INSTALLED_BROWSER_POLICY = {
  host: '127.0.0.1',
  port: 0,
  applications: 2,
  label: 'Email summaries',
  disabled: 'Email summaries are disabled.',
  enabled: 'Email summaries are enabled.',
  display: 'flex',
} as const;

export async function exerciseInstalledBootstrap(consumer: string): Promise<void> {
  const policy = INSTALLED_BROWSER_POLICY;
  const server = await preview({
    root: consumer,
    configFile: false,
    preview: { host: policy.host, port: policy.port, strictPort: true },
  });
  try {
    const address = server.httpServer.address();
    if (address === null || typeof address === 'string') {
      throw new Error('Installed consumer preview requires a TCP address.');
    }
    const browser = await chromium.launch();
    try {
      const page = await browser.newPage();
      const errors: string[] = [];
      page.on('pageerror', (error) => errors.push(error.message));
      await page.goto(`http://${policy.host}:${address.port}`);
      const switches = page.getByRole('switch', { name: policy.label });
      const first = switches.first();
      const second = switches.last();
      await expect(switches).toHaveCount(policy.applications);
      await expect(first).toHaveCSS('display', policy.display);
      await expect(first).toHaveAttribute('aria-checked', 'false');
      await expect(second).toHaveAttribute('aria-checked', 'false');
      await expect(page.getByText(policy.disabled)).toHaveCount(policy.applications);
      await first.click();
      await expect(first).toHaveAttribute('aria-checked', 'true');
      await expect(second).toHaveAttribute('aria-checked', 'false');
      await expect(page.getByText(policy.enabled)).toBeVisible();
      await expect(page.getByText(policy.disabled)).toBeVisible();
      await first.click();
      await expect(first).toHaveAttribute('aria-checked', 'false');
      await expect(page.getByText(policy.disabled)).toHaveCount(policy.applications);
      await second.click();
      await expect(first).toHaveAttribute('aria-checked', 'false');
      await expect(second).toHaveAttribute('aria-checked', 'true');
      assert.deepEqual(errors, [], 'Installed application emitted browser errors.');
    } finally {
      await browser.close();
    }
  } finally {
    await new Promise<void>((resolve, reject) => {
      server.httpServer.close((error) => {
        if (error) reject(error);
        else resolve();
      });
    });
  }
}
