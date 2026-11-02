import { readFileSync } from 'node:fs';
import { expect, it } from 'vitest';
import { parse } from 'yaml';
import { z } from 'zod';

const permissions = z.record(z.string(), z.string());
const step = z.object({
  uses: z.string().optional(),
  run: z.string().optional(),
  if: z.string().optional(),
  with: z.record(z.string(), z.unknown()).optional(),
  'continue-on-error': z.boolean().optional(),
});
function documentation() {
  const source: unknown = parse(
    readFileSync('.github/workflows/documentation.yml', 'utf8'),
  );
  return z
    .object({
      on: z.object({ push: z.object({ branches: z.array(z.string()) }) }).strict(),
      permissions,
      concurrency: z.object({
        group: z.string(),
        'cancel-in-progress': z.boolean(),
      }),
      env: z.record(z.string(), z.string()),
      jobs: z
        .object({
          check: z.object({ permissions, steps: z.array(step) }),
          deploy: z.object({ needs: z.string(), uses: z.string(), permissions }),
        })
        .strict(),
    })
    .parse(source);
}

it('checks main documentation independently with read-only source access', () => {
  const workflow = documentation();
  expect(workflow.on.push.branches).toEqual(['main']);
  expect(workflow.permissions).toEqual({ contents: 'read' });
  expect(workflow.jobs.check.permissions).toEqual({ contents: 'read' });
  expect(workflow.env['NODE_VERSION']).toBe('22.23.4');
  expect(workflow.concurrency).toEqual({
    group: 'documentation-main',
    'cancel-in-progress': true,
  });
  const checkout = workflow.jobs.check.steps.find((entry) =>
    entry.uses?.startsWith('actions/checkout@'),
  );
  const setup = workflow.jobs.check.steps.find((entry) =>
    entry.uses?.startsWith('actions/setup-node@'),
  );
  expect(setup?.with?.['package-manager-cache']).toBe(false);
  expect(checkout?.with).toEqual({
    ref: '${{ github.sha }}',
    'persist-credentials': false,
  });
});

it('requires source gates, the canonical build and every documentation browser', () => {
  const steps = documentation().jobs.check.steps;
  expect(steps.flatMap((entry) => (entry.run ? [entry.run] : []))).toEqual([
    'npm install --global npm@11.19.0',
    'npm ci',
    'npm run policy',
    'npm run lint:layers',
    'npm run typecheck',
    'npm run lint',
    'npm run schema:check',
    'npm run fixtures:check',
    'npm run docs:check',
    'npx playwright install --with-deps chromium firefox webkit',
    'npm run test:docs',
  ]);
  for (const entry of steps) {
    expect(entry['continue-on-error']).not.toBe(true);
    if (entry.uses) expect(entry.uses).toMatch(/^actions\/[a-z-]+@[a-f0-9]{40}$/);
    if (entry.with) expect(entry.with).not.toHaveProperty('cache');
    expect(entry.if).toBe(
      entry.with?.['name'] === 'failed-docs-${{ github.sha }}'
        ? 'failure()'
        : undefined,
    );
  }
});

it('publishes only the same-run checked artifact through least-privilege Pages', () => {
  const workflow = documentation();
  const upload = workflow.jobs.check.steps.at(-1);
  expect(upload?.uses).toMatch(/^actions\/upload-artifact@[a-f0-9]{40}$/);
  expect(upload?.if).toBeUndefined();
  expect(upload?.with).toEqual({
    name: 'docs-${{ github.sha }}',
    path: 'site/',
    'if-no-files-found': 'error',
    'include-hidden-files': true,
    'retention-days': 14,
  });
  expect(workflow.jobs.deploy).toEqual({
    needs: 'check',
    uses: './.github/workflows/pages.yml',
    permissions: {
      contents: 'read',
      actions: 'read',
      pages: 'write',
      'id-token': 'write',
    },
  });
});

it('preserves browser diagnostics only after a failed documentation check', () => {
  const steps = documentation().jobs.check.steps;
  const failed = steps.find(
    (entry) => entry.with?.['name'] === 'failed-docs-${{ github.sha }}',
  );
  expect(failed?.uses).toMatch(/^actions\/upload-artifact@[a-f0-9]{40}$/);
  expect(failed?.if).toBe('failure()');
  expect(failed?.with).toEqual({
    name: 'failed-docs-${{ github.sha }}',
    path: 'test-results/docs-devices/\nplaywright-report/docs-devices/\n',
    'if-no-files-found': 'ignore',
    'include-hidden-files': true,
    'retention-days': 14,
  });
});
