import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { parse } from 'yaml';
import { z } from 'zod';

const step = z.object({
  name: z.string().optional(),
  run: z.string().optional(),
  env: z.record(z.string(), z.string()).optional(),
  uses: z.string().optional(),
  if: z.string().optional(),
  with: z.record(z.string(), z.unknown()).optional(),
  'continue-on-error': z.boolean().optional(),
});
const job = z.object({
  if: z.string().optional(),
  needs: z
    .union([z.array(z.string()), z.string()])
    .transform((value) => (typeof value === 'string' ? [value] : value))
    .optional(),
  permissions: z.record(z.string(), z.string()).optional(),
  steps: z.array(step).optional(),
});
function workflow() {
  const input: unknown = parse(readFileSync('.github/workflows/release.yml', 'utf8'));
  return z.object({ jobs: z.record(z.string(), job) }).parse(input);
}

describe('coupled publication workflow acceptance', () => {
  it('keeps release-please output private until both npm versions are verified', () => {
    const input: unknown = JSON.parse(
      readFileSync('release-please-config.json', 'utf8'),
    );
    expect(
      z
        .object({ draft: z.literal(true), 'force-tag-creation': z.literal(true) })
        .safeParse(input).success,
    ).toBe(true);
    const complete = workflow().jobs['complete'];
    expect(complete?.needs).toContain('publish');
    expect(complete?.if).toContain("needs.publish.result == 'success'");
    expect(complete?.if).toContain('!cancelled()');
    expect(complete?.permissions?.['contents']).toBe('write');
    expect(complete?.permissions).not.toHaveProperty('id-token');
    expect(complete?.steps?.some((s) => s.run === 'npm run release:complete')).toBe(
      true,
    );
  });
  it('provides the bootstrap credential only to runner publication', () => {
    const jobs = workflow().jobs;
    for (const [name, value] of Object.entries(jobs)) {
      for (const s of value.steps ?? []) {
        if (s.env?.['NODE_AUTH_TOKEN']) {
          expect(name).toBe('publish');
          expect(s.run).toBe('npm run release:publish');
          expect(s.env['NODE_AUTH_TOKEN']).toBe('${{ secrets.NPM_TOKEN }}');
        }
        expect(s['continue-on-error']).not.toBe(true);
      }
    }
  });
  it('checks archives before upload and public bytes after', () => {
    const steps = workflow().jobs['publish']?.steps ?? [];
    const candidate = steps.findIndex((s) => s.run === 'npm run release:candidate');
    const upload = steps.findIndex((s) => s.run === 'npm run release:publish');
    const registry = steps.findIndex((s) => s.run === 'npm run release:registry');
    expect(candidate).toBeGreaterThanOrEqual(0);
    expect(upload).toBeGreaterThan(candidate);
    expect(registry).toBeGreaterThan(upload);
  });
  it('recovers immutable tags using explicitly checked workflow code', () => {
    const recovery = workflow().jobs['recover'];
    expect(recovery?.if).toBe("github.event_name == 'workflow_dispatch'");
    expect(recovery?.permissions?.['actions']).toBe('read');
    expect(recovery?.permissions).not.toHaveProperty('id-token');
    expect(recovery?.steps?.some((s) => s.run === 'npm run release:recover')).toBe(
      true,
    );
    const verify = workflow().jobs['publish']?.steps?.find(
      (s) => s.run === 'npm run release:verify',
    );
    expect(verify?.env?.['CHECKED_RELEASE_SHA']).toContain('checked_sha');
    expect(verify?.env?.['RELEASE_RECOVERY']).toContain('workflow_dispatch');
  });
});

it('accepts only the fixed repository upload URL when passing a draft ID', () => {
  const script = z
    .string()
    .parse(
      workflow().jobs['release']?.steps?.find(
        (s) => s.name === 'Read the prepared draft identity',
      )?.run,
    );
  expect(script).not.toContain('${{');
  const prefix = 'https://uploads.github.com/repos/FastSprout/Reacd/releases/';
  for (const [url, accepted] of [
    [prefix + '123/assets{?name,label}', true],
    ['https://foreign.example/releases/123/assets', false],
    [prefix + '0/assets', false],
    [prefix + '$(touch injected)/assets', false],
  ] as const) {
    const directory = mkdtempSync(join(tmpdir(), 'reacd-draft-id-'));
    const output = join(directory, 'output');
    writeFileSync(output, '');
    try {
      const result = spawnSync('bash', ['--noprofile', '--norc', '-e', '-c', script], {
        cwd: directory,
        encoding: 'utf8',
        env: { ...process.env, BASH_ENV: '', UPLOAD_URL: url, GITHUB_OUTPUT: output },
      });
      expect(result.status === 0).toBe(accepted);
      expect(readFileSync(output, 'utf8')).toBe(accepted ? 'release_id=123\n' : '');
      expect(readdirSync(directory)).toEqual(['output']);
    } finally {
      rmSync(directory, { recursive: true, force: true });
    }
  }
});

it('rejects disabled publication and unchecked source SHAs', () => {
  const script = z
    .string()
    .parse(
      workflow().jobs['release']?.steps?.find(
        (s) => s.name === 'Require publication for a release candidate',
      )?.run,
    );
  for (const [enabled, checked, accepted] of [
    ['true', 'a'.repeat(40), true],
    ['false', 'a'.repeat(40), false],
    ['true', 'b'.repeat(40), false],
  ] as const) {
    const result = spawnSync('bash', ['--noprofile', '--norc', '-e', '-c', script], {
      encoding: 'utf8',
      env: {
        ...process.env,
        BASH_ENV: '',
        PUBLICATION_ENABLED: enabled,
        RELEASE_SHA: 'a'.repeat(40),
        CHECKED_SHA: checked,
      },
    });
    expect(result.status === 0).toBe(accepted);
  }
});
