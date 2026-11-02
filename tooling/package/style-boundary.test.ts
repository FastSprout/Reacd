import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { expect, it } from 'vitest';
import { build } from 'vite';

it('isolates SDK utilities and preserves explicit host sources', async () => {
  const temporary = mkdtempSync(join(tmpdir(), 'reacd-style-boundary-'));
  const configFile = resolve('vite.styles.config.ts');
  const sdk = join(temporary, 'sdk');
  const host = join(temporary, 'host');
  try {
    await build({ configFile, logLevel: 'silent', build: { outDir: sdk } });
    const sdkStyles = readFileSync(join(sdk, 'styles.css'), 'utf8');
    expect(sdkStyles).toContain('.bg-primary');
    expect(sdkStyles).toContain('prefers-reduced-motion');
    const utilities = ['shadow', 'shadow-xs', 'shadow-sm', 'shadow-md', 'shadow-lg'];
    for (const utility of utilities) {
      expect(sdkStyles).toContain(`.${utility}{--tw-shadow:var(--sdk-shadow,`);
    }
    expect(sdkStyles.includes('1987px')).toBe(false);
    const input = join(temporary, 'host.css');
    const source = resolve('tooling/package/fixtures/unrelated-styles.html.txt');
    writeFileSync(
      input,
      `@import ${JSON.stringify(resolve('src/adapter/shadcn/styles.css'))};\n` +
        `@source ${JSON.stringify(source)};\n`,
    );
    await build({
      configFile,
      logLevel: 'silent',
      build: { outDir: host, rolldownOptions: { input } },
    });
    expect(readFileSync(join(host, 'styles.css'), 'utf8')).toContain('1987px');
    expect(readFileSync(join(sdk, 'styles.css'), 'utf8')).toBe(sdkStyles);
  } finally {
    rmSync(temporary, { recursive: true, force: true });
  }
});
