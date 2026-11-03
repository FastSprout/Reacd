import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { expect, it } from 'vitest';
import { parse } from 'yaml';
import { z } from 'zod';
import { RELEASE_SOURCE_POLICY } from './github-client.js';

function gate() {
  const source: unknown = parse(readFileSync('.github/workflows/check.yml', 'utf8'));
  return z
    .object({
      jobs: z.object({
        check: z.object({
          name: z.string(),
          'continue-on-error': z.literal(false).optional(),
          if: z.string(),
          needs: z.array(z.string()),
          steps: z.array(
            z.object({
              run: z.string(),
              'continue-on-error': z.literal(false).optional(),
              env: z.record(z.string(), z.string()),
            }),
          ),
        }),
      }),
    })
    .parse(source).jobs.check;
}

it('preserves the trusted check / check identity after every required job', () => {
  const value = gate();
  expect(`check / ${value.name}`).toBe(RELEASE_SOURCE_POLICY.checkJob);
  expect(value.if).toBe('always()');
  expect(value.needs).toEqual(['build', 'coverage', 'components', 'documentation']);
  expect(value.steps).toHaveLength(1);
  expect(value.steps[0]?.env).toEqual({
    BUILD_RESULT: '${{ needs.build.result }}',
    COVERAGE_RESULT: '${{ needs.coverage.result }}',
    COMPONENT_RESULT: '${{ needs.components.result }}',
    DOCS_RESULT: '${{ needs.documentation.result }}',
  });
});

const results = ['BUILD_RESULT', 'COVERAGE_RESULT', 'COMPONENT_RESULT', 'DOCS_RESULT'];
it.each(results)(
  'rejects incomplete dependency %s using the real gate shell',
  (key) => {
    const source = gate().steps[0];
    if (!source) throw new Error('Missing terminal gate.');
    expect(source.run).not.toContain('${{');
    for (const result of ['failure', 'skipped', 'cancelled', '']) {
      const env = Object.fromEntries(results.map((name) => [name, 'success']));
      env[key] = result;
      const run = spawnSync('bash', ['--noprofile', '--norc', '-e', '-c', source.run], {
        env: { ...process.env, BASH_ENV: '', ...env },
        encoding: 'utf8',
      });
      expect(run.status, `${key}=${result}`).toBe(1);
    }
  },
);

it('succeeds only when every required source and matrix job succeeded', () => {
  const source = gate().steps[0];
  if (!source) throw new Error('Missing terminal gate.');
  const env = Object.fromEntries(results.map((name) => [name, 'success']));
  const run = spawnSync('bash', ['--noprofile', '--norc', '-e', '-c', source.run], {
    env: { ...process.env, BASH_ENV: '', ...env },
    encoding: 'utf8',
  });
  expect(run.error).toBeUndefined();
  expect(run.status).toBe(0);
});
