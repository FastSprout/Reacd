import { readFileSync } from 'node:fs';
import { expect, it } from 'vitest';
import { parse } from 'yaml';
import { z } from 'zod';
import components from '../../playwright.config.js';
import docs from '../../playwright.docs.config.js';

const strings = z.record(z.string(), z.string());
const step = z.object({
  run: z.string().optional(),
  uses: z.string().optional(),
  if: z.string().optional(),
  env: strings.optional(),
  with: z.record(z.string(), z.unknown()).optional(),
  'continue-on-error': z.boolean().optional(),
});
const job = z.object({
  needs: z.string().optional(),
  'continue-on-error': z.literal(false).optional(),
  steps: z.array(step),
  strategy: z
    .object({
      'fail-fast': z.boolean(),
      matrix: z
        .object({
          include: z.array(
            z
              .object({
                project: z.string(),
                browser: z.string(),
                workers: z.number(),
              })
              .strict(),
          ),
        })
        .strict(),
    })
    .strict()
    .optional(),
});
function workflow() {
  const source: unknown = parse(readFileSync('.github/workflows/check.yml', 'utf8'));
  return z
    .object({
      name: z.literal('Check'),
      permissions: strings,
      on: z.object({
        pull_request: z.null(),
        push: z.object({ 'branches-ignore': z.array(z.string()) }),
        workflow_call: z.null(),
      }),
      jobs: z.object({
        build: job,
        coverage: job,
        components: job,
        documentation: job,
      }),
    })
    .parse(source);
}

it('keeps read-only triggers and builds/packages once after every source guard', () => {
  const value = workflow();
  expect(value.permissions).toEqual({ contents: 'read' });
  expect(value.on.push['branches-ignore']).toEqual(['main']);
  const commands = value.jobs.build.steps.flatMap((s) => (s.run ? [s.run] : []));
  expect(commands).toEqual([
    'npm install --global npm@11.19.0',
    'npm ci',
    'npm run policy',
    'npm run lint:layers',
    'npm run typecheck',
    'npm run lint',
    'npm run schema:check',
    'npm run fixtures:check',
    'npm run docs:check',
    'npx playwright install --with-deps chromium',
    'npm run test:package',
  ]);
});

it('restores complete build dependencies from one checked SHA', () => {
  const jobs = workflow().jobs;
  const upload = jobs.build.steps.at(-1);
  expect(upload?.uses).toMatch(/^actions\/upload-artifact@[a-f0-9]{40}$/);
  expect(upload?.if).toBeUndefined();
  expect(upload?.with).toMatchObject({
    name: 'check-build-${{ github.sha }}',
    path:
      'dist/\npackages/shadcn/dist/\npackages/mui/dist/\nsite/\n' +
      '.cache/site-runtime-dist/runtime-modules.json\n' +
      '.cache/conformance-dist/\n.cache/examples/counter/\n' +
      '.cache/examples/form/\n.cache/examples/dashboard/\n',
    'if-no-files-found': 'error',
    'include-hidden-files': true,
  });
  for (const consumer of [jobs.coverage, jobs.components, jobs.documentation]) {
    expect(consumer.needs).toBe('build');
    const downloads = consumer.steps.filter((s) =>
      s.uses?.startsWith('actions/download-artifact@'),
    );
    expect(downloads.map((s) => s.with)).toEqual([
      { name: 'check-build-${{ github.sha }}', path: '.' },
    ]);
    for (const entry of consumer.steps) {
      expect(entry.run ?? '').not.toMatch(/npm run (?:build|docs:check)/);
      expect(entry['continue-on-error']).not.toBe(true);
    }
  }
});

it('keeps complete per-file coverage as an independent unchanged command', () => {
  const steps = workflow().jobs.coverage.steps;
  expect(steps.flatMap((s) => (s.run ? [s.run] : []))).toEqual([
    'npm install --global npm@11.19.0',
    'npm ci',
    'npm run test:coverage',
  ]);
});

it('runs every native component project with bounded workers', () => {
  const job = workflow().jobs.components;
  expect(job.strategy).toEqual({
    'fail-fast': false,
    matrix: {
      include: [
        { project: 'mui', browser: 'chromium', workers: 2 },
        { project: 'shadcn', browser: 'chromium', workers: 2 },
        { project: 'pin-chromium', browser: 'chromium', workers: 1 },
        { project: 'pin-firefox', browser: 'firefox', workers: 1 },
        { project: 'pin-webkit', browser: 'webkit', workers: 1 },
      ],
    },
  });
  expect(job.strategy?.matrix.include.map((entry) => entry.project)).toEqual(
    components.projects?.map((project) => project.name),
  );
  expect(job.steps.find((s) => s.run?.startsWith('npm run test:browser'))?.run).toBe(
    'npm run test:browser -- --project="$PROJECT" --workers="$WORKERS" ' +
      '--reporter=list,html,github',
  );
});

it('preserves every documentation project and current native worker policy', () => {
  const job = workflow().jobs.documentation;
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
  expect(job.strategy?.matrix.include.map((entry) => entry.project)).toEqual(
    docs.projects?.map((project) => project.name),
  );
  expect(job.steps.find((s) => s.run?.startsWith('npm run test:docs'))?.run).toBe(
    'npm run test:docs -- --project="$PROJECT" --workers="$WORKERS" ' +
      '--reporter=list,html,github',
  );
});

it('keeps pinned read-only source, GitHub annotations and unique diagnostics', () => {
  for (const [name, value] of Object.entries(workflow().jobs)) {
    for (const entry of value.steps) {
      if (entry.uses) expect(entry.uses).toMatch(/^actions\/[a-z-]+@[a-f0-9]{40}$/);
      expect(entry['continue-on-error']).not.toBe(true);
      if (entry.uses?.startsWith('actions/checkout@'))
        expect(entry.with).toMatchObject({ 'persist-credentials': false });
      if (entry.uses?.startsWith('actions/setup-node@'))
        expect(entry.with?.['package-manager-cache']).toBe(false);
    }
    if (name === 'components' || name === 'documentation') {
      const install = value.steps.find((s) => s.run?.includes('playwright install'));
      expect(install?.run).toBe('npx playwright install --with-deps "$BROWSER"');
      expect(install?.env).toEqual({ BROWSER: '${{ matrix.browser }}' });
      const run = value.steps.find((s) => s.run?.startsWith('npm run test:'));
      expect(run?.env).toEqual({
        PROJECT: '${{ matrix.project }}',
        WORKERS: '${{ matrix.workers }}',
        PLAYWRIGHT_HTML_OUTPUT_DIR: 'playwright-report',
        PLAYWRIGHT_HTML_OPEN: 'never',
      });
      expect(value.steps.at(-1)).toMatchObject({
        if: 'failure()',
        with: { name: `failed-${name}-` + '${{ matrix.project }}-${{ github.sha }}' },
      });
    }
  }
});
