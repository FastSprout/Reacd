import { readFileSync } from 'node:fs';
import { expect, it } from 'vitest';
import { parse } from 'yaml';
import { z } from 'zod';

const permissions = z.record(z.string(), z.string());
const step = z.object({
  id: z.string().optional(),
  uses: z.string().optional(),
  run: z.string().optional(),
  with: z.record(z.string(), z.unknown()).optional(),
});

it('deploys the checked main artifact without rebuilding', () => {
  const source: unknown = parse(readFileSync('.github/workflows/pages.yml', 'utf8'));
  const pages = z
    .object({
      on: z.object({ workflow_call: z.null() }).strict(),
      permissions,
      jobs: z.object({
        deploy: z.object({
          if: z.string(),
          permissions,
          environment: z.object({ name: z.string(), url: z.string() }),
          steps: z.array(step),
        }),
      }),
    })
    .parse(source);
  expect(pages.permissions).toEqual({ contents: 'read' });
  const job = pages.jobs.deploy;
  expect(job.if).toContain("github.event_name == 'push'");
  expect(job.if).toContain("github.ref == 'refs/heads/main'");
  expect(job.permissions).toEqual({
    contents: 'read',
    actions: 'read',
    pages: 'write',
    'id-token': 'write',
  });
  expect(job.environment.name).toBe('github-pages');
  expect(job.environment.url).toBe('${{ steps.deployment.outputs.page_url }}');
  expect(
    job.steps.find((entry) => entry.uses?.startsWith('actions/download-artifact@')),
  ).toMatchObject({
    with: { name: 'docs-${{ github.sha }}', path: 'site' },
  });
  expect(
    job.steps.find((entry) => entry.uses?.startsWith('actions/upload-pages-artifact@')),
  ).toMatchObject({ with: { path: 'site' } });
  expect(job.steps.at(-1)).toMatchObject({ id: 'deployment' });
  for (const entry of job.steps) {
    expect(entry.run).toBeUndefined();
    expect(entry.uses).toMatch(/^actions\/[a-z-]+@[a-f0-9]{40}$/);
  }
});

it('keeps release publication gated without duplicating Pages deployment', () => {
  const source: unknown = parse(readFileSync('.github/workflows/release.yml', 'utf8'));
  const release = z
    .object({
      jobs: z
        .object({
          check: z.object({ uses: z.string() }),
          release: z.object({ needs: z.string() }),
        })
        .passthrough(),
    })
    .parse(source);
  expect(release.jobs.check.uses).toBe('./.github/workflows/check.yml');
  expect(release.jobs.release.needs).toBe('check');
  expect(release.jobs).not.toHaveProperty('documentation');
});
