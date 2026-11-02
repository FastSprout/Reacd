import { readFileSync } from 'node:fs';
import { expect, it } from 'vitest';
import { parse } from 'yaml';
import { z } from 'zod';
import docs from '../../playwright.docs.config.js';

const permissions = z.record(z.string(), z.string());
const stringMap = z.record(z.string(), z.string());
const step = z.object({
  uses: z.string().optional(),
  run: z.string().optional(),
  if: z.string().optional(),
  env: stringMap.optional(),
  with: z.record(z.string(), z.unknown()).optional(),
  'continue-on-error': z.boolean().optional(),
});
const checks = z.object({ permissions, steps: z.array(step) });
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
      env: stringMap,
      jobs: z
        .object({
          check: checks,
          browsers: checks.extend({
            needs: z.string(),
            strategy: z.object({
              'fail-fast': z.boolean(),
              matrix: z.object({
                include: z.array(
                  z.object({
                    project: z.string(),
                    browser: z.string(),
                    workers: z.number(),
                  }),
                ),
              }),
            }),
          }),
          deploy: z.object({
            needs: z.array(z.string()),
            uses: z.string(),
            permissions,
          }),
        })
        .strict(),
    })
    .parse(source);
}

it('checks exact main source read-only without dependency caches', () => {
  const workflow = documentation();
  expect(workflow.on.push.branches).toEqual(['main']);
  expect(workflow.permissions).toEqual({ contents: 'read' });
  expect(workflow.jobs.check.permissions).toEqual({ contents: 'read' });
  expect(workflow.env['NODE_VERSION']).toBe('22.23.4');
  expect(workflow.concurrency).toEqual({
    group: 'documentation-main',
    'cancel-in-progress': true,
  });
  for (const job of [workflow.jobs.check, workflow.jobs.browsers]) {
    const checkout = job.steps.find((entry) =>
      entry.uses?.startsWith('actions/checkout@'),
    );
    expect(checkout?.with).toEqual({
      ref: '${{ github.sha }}',
      'persist-credentials': false,
    });
    const setup = job.steps.find((entry) =>
      entry.uses?.startsWith('actions/setup-node@'),
    );
    expect(setup?.with?.['package-manager-cache']).toBe(false);
    for (const entry of job.steps) {
      expect(entry['continue-on-error']).not.toBe(true);
      if (entry.uses) expect(entry.uses).toMatch(/^actions\/[a-z-]+@[a-f0-9]{40}$/);
      if (entry.with) expect(entry.with).not.toHaveProperty('cache');
      expect(entry.if).toBe(
        entry.with?.['name'] === 'failed-docs-${{ matrix.project }}-${{ github.sha }}'
          ? 'failure()'
          : undefined,
      );
    }
  }
});

it('requires source guards and builds the public artifact exactly once', () => {
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
  ]);
  const upload = steps.find(
    (entry) => entry.with?.['name'] === 'docs-${{ github.sha }}',
  );
  expect(upload?.uses).toMatch(/^actions\/upload-artifact@[a-f0-9]{40}$/);
  expect(upload?.if).toBeUndefined();
  expect(upload?.with).toEqual({
    name: 'docs-${{ github.sha }}',
    path: 'site/',
    'if-no-files-found': 'error',
    'include-hidden-files': true,
    'retention-days': 14,
  });
});

it('runs every exact project with isolated native engines and bounded workers', () => {
  const job = documentation().jobs.browsers;
  expect(job.needs).toBe('check');
  expect(job.permissions).toEqual({ contents: 'read', actions: 'read' });
  expect(job.strategy).toEqual({
    'fail-fast': false,
    matrix: {
      include: [
        { project: 'docs-chromium', browser: 'chromium', workers: 2 },
        { project: 'docs-firefox', browser: 'firefox', workers: 2 },
        { project: 'docs-webkit', browser: 'webkit', workers: 1 },
        { project: 'docs-iphone', browser: 'webkit', workers: 1 },
        { project: 'docs-android', browser: 'chromium', workers: 1 },
      ],
    },
  });
  expect(job.steps.flatMap((entry) => (entry.run ? [entry.run] : []))).toEqual([
    'npm install --global npm@11.19.0',
    'npm ci',
    'npx playwright install --with-deps "$PLAYWRIGHT_BROWSER"',
    'npm run test:docs -- --project="$DOCS_PROJECT" --workers="$DOCS_WORKERS" ' +
      '--reporter=list,html,github',
  ]);
  expect(job.strategy.matrix.include.map((entry) => entry.project)).toEqual(
    docs.projects?.map((project) => project.name),
  );
  const run = job.steps.find((entry) => entry.run?.startsWith('npm run test:docs'));
  expect(run?.env).toEqual({
    DOCS_PROJECT: '${{ matrix.project }}',
    DOCS_WORKERS: '${{ matrix.workers }}',
    PLAYWRIGHT_HTML_OUTPUT_DIR: 'playwright-report/docs-devices',
    PLAYWRIGHT_HTML_OPEN: 'never',
  });
  const install = job.steps.find((entry) => entry.run?.includes('playwright install'));
  expect(install?.env).toEqual({ PLAYWRIGHT_BROWSER: '${{ matrix.browser }}' });
});

it('restores immutable site and private provenance without rebuilding', () => {
  const { check, browsers } = documentation().jobs;
  const metadata = check.steps.find(
    (entry) => entry.with?.['name'] === 'docs-runtime-${{ github.sha }}',
  );
  expect(metadata?.with).toEqual({
    name: 'docs-runtime-${{ github.sha }}',
    path: '.cache/site-runtime-dist/runtime-modules.json',
    'if-no-files-found': 'error',
    'include-hidden-files': true,
    'retention-days': 14,
  });
  const downloads = browsers.steps.filter((entry) =>
    entry.uses?.startsWith('actions/download-artifact@'),
  );
  expect(downloads.map((entry) => entry.with)).toEqual([
    { name: 'docs-${{ github.sha }}', path: 'site' },
    { name: 'docs-runtime-${{ github.sha }}', path: '.cache/site-runtime-dist' },
  ]);
});

it('publishes only after source and the complete native matrix succeed', () => {
  expect(documentation().jobs.deploy).toEqual({
    needs: ['check', 'browsers'],
    uses: './.github/workflows/pages.yml',
    permissions: {
      contents: 'read',
      actions: 'read',
      pages: 'write',
      'id-token': 'write',
    },
  });
});

it('preserves project-specific browser diagnostics on failure', () => {
  const failed = documentation().jobs.browsers.steps.at(-1);
  expect(failed?.uses).toMatch(/^actions\/upload-artifact@[a-f0-9]{40}$/);
  expect(failed?.if).toBe('failure()');
  expect(failed?.with).toEqual({
    name: 'failed-docs-${{ matrix.project }}-${{ github.sha }}',
    path: 'test-results/docs-devices/\nplaywright-report/docs-devices/\n',
    'if-no-files-found': 'ignore',
    'include-hidden-files': true,
    'retention-days': 14,
  });
});
