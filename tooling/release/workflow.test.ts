import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { parse } from 'yaml';
import { z } from 'zod';

const workflowPath = resolve('.github/workflows/release.yml');
const stringMap = z.record(z.string(), z.string());
const stepSchema = z.object({
  id: z.string().optional(),
  env: stringMap.optional(),
  run: z.string().optional(),
  if: z.string().optional(),
  'continue-on-error': z.boolean().optional(),
});
const workflowSchema = z.object({
  jobs: z.object({
    release: z.object({
      permissions: stringMap,
      outputs: stringMap,
      steps: z.array(stepSchema),
    }),
    publish: z.object({
      if: z.string(),
      permissions: stringMap,
      steps: z.array(stepSchema),
    }),
  }),
});
const publicationSchema = z.object({
  id: z.literal('publication'),
  env: stringMap,
  run: z.string().min(1),
});

function readWorkflow() {
  const document: unknown = parse(readFileSync(workflowPath, 'utf8'));
  return workflowSchema.parse(document);
}

function publicationStep() {
  return publicationSchema.parse(
    readWorkflow().jobs.release.steps.find((step) => step.id === 'publication'),
  );
}

const CASES = [
  { label: 'literal true', value: 'true', enabled: true },
  { label: 'uppercase', value: 'TRUE', enabled: false },
  { label: 'mixed case', value: 'True', enabled: false },
  { label: 'false', value: 'false', enabled: false },
  { label: 'empty', value: '', enabled: false },
  { label: 'spaces', value: '  ', enabled: false },
  { label: 'leading space', value: ' true', enabled: false },
  { label: 'trailing space', value: 'true ', enabled: false },
  { label: 'tab', value: '\ttrue', enabled: false },
  { label: 'number', value: '1', enabled: false },
  { label: 'JSON boolean text', value: '{"enabled":true}', enabled: false },
  { label: 'JSON string text', value: '"true"', enabled: false },
  { label: 'malformed JSON', value: '{', enabled: false },
  { label: 'newline', value: 'true\n', enabled: false },
  { label: 'output-like newline', value: 'true\nenabled=true', enabled: false },
  { label: 'shell operator', value: 'true || false', enabled: false },
  { label: 'shell command', value: 'true; touch injected', enabled: false },
  { label: 'substitution', value: '$(touch injected)', enabled: false },
  { label: 'backticks', value: '`touch injected`', enabled: false },
] as const;

describe('publication workflow capability boundary', () => {
  it('updates the adapter version and engine peer with the shared release', () => {
    const config: unknown = JSON.parse(
      readFileSync('release-please-config.json', 'utf8'),
    );
    const parsed = z
      .object({
        packages: z.object({
          '.': z.object({ 'extra-files': z.array(z.unknown()) }),
        }),
      })
      .parse(config);
    for (const jsonpath of ['$.version', "$.peerDependencies['@fastsprout/reacd']"]) {
      expect(parsed.packages['.']['extra-files']).toContainEqual({
        type: 'json',
        path: 'packages/shadcn/package.json',
        jsonpath,
      });
    }
  });
  it('uses verified retryable publication before confirming both packages', () => {
    const steps = readWorkflow().jobs.publish.steps;
    const upload = steps.findIndex((step) => step.run === 'npm run release:publish');
    expect(upload).toBeGreaterThanOrEqual(0);
    expect(steps[upload + 1]).toMatchObject({ run: 'npm run release:registry' });
    expect(steps[upload + 1]?.if).toBeUndefined();
    expect(steps[upload + 1]?.['continue-on-error']).toBeUndefined();
    expect(steps.some((step) => step.run?.startsWith('npm publish '))).toBe(false);
    expect(
      steps.findIndex((step) => step.run === 'npm run release:registry'),
    ).toBeGreaterThan(upload);
  });
  it('normalizes raw enablement only in the non-OIDC job', () => {
    const { release, publish } = readWorkflow().jobs;
    const step = publicationStep();
    expect(release.permissions).not.toHaveProperty('id-token');
    expect(step.env).toEqual({
      PUBLISH_ENABLED: '${{ vars.NPM_PUBLISH_ENABLED }}',
    });
    expect(step.run).not.toContain('${{');
    expect(release.outputs['publish_enabled']).toBe(
      '${{ steps.publication.outputs.enabled }}',
    );
    expect(publish.permissions['id-token']).toBe('write');
  });

  it('gates the whole capability job on trusted enablement and exact source', () => {
    const { publish } = readWorkflow().jobs;
    expect(publish.if).not.toContain('vars.NPM_PUBLISH_ENABLED');
    expect(publish.if).toContain("needs.release.outputs.release_created == 'true'");
    expect(publish.if).toContain('needs.release.outputs.sha == github.sha');
    expect(publish.if).toContain("needs.release.outputs.publish_enabled == 'true'");
    expect(publish.if).toContain("needs.recover.result == 'success'");
    expect(publish.if).toContain(
      'needs.recover.outputs.sha == needs.recover.outputs.checked_sha',
    );
    const verify = publish.steps.find((step) => step.run === 'npm run release:verify');
    expect(verify?.env?.['NPM_PUBLISH_ENABLED']).toBe(
      '${{ vars.NPM_PUBLISH_ENABLED }}',
    );
  });

  it.each(CASES)('executes actual Bash for $label', ({ value, enabled }) => {
    const directory = mkdtempSync(join(tmpdir(), 'reacd-publication-'));
    const output = join(directory, 'job output.txt');
    try {
      writeFileSync(output, '');
      const result = spawnSync(
        'bash',
        ['--noprofile', '--norc', '-e', '-o', 'pipefail', '-c', publicationStep().run],
        {
          cwd: directory,
          env: {
            ...process.env,
            BASH_ENV: '',
            PUBLISH_ENABLED: value,
            GITHUB_OUTPUT: output,
          },
          encoding: 'utf8',
        },
      );
      expect(result.error).toBeUndefined();
      expect(result.status).toBe(0);
      expect(result.stdout).toBe('');
      expect(result.stderr).toBe('');
      expect(readFileSync(output, 'utf8')).toBe(`enabled=${enabled}\n`);
      expect(readdirSync(directory)).toEqual(['job output.txt']);
    } finally {
      rmSync(directory, { recursive: true, force: true });
    }
  });
});
