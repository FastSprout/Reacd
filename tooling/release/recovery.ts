import { z } from 'zod';
import {
  releaseShaSchema,
  RELEASE_SOURCE_POLICY,
  resolveReleaseTag,
} from './github-client.js';
import type { ReleaseGitHub } from './github-client.js';
import { isReleaseVersion, PUBLICATION_POLICY } from './policy.js';

const contextSchema = z.object({
  tag: z
    .string()
    .regex(/^v\d+\.\d+\.\d+$/)
    .refine((value) => isReleaseVersion(value.slice(1))),
  workflowSha: releaseShaSchema,
  event: z.literal('workflow_dispatch'),
  ref: z.literal('refs/heads/main'),
  actions: z.literal('true'),
  repository: z.literal(PUBLICATION_POLICY.githubRepository),
  runner: z.literal('github-hosted'),
});
const runsSchema = z.object({
  workflow_runs: z.array(
    z.object({
      id: z.number().int().positive(),
      head_sha: releaseShaSchema,
      path: z.string(),
      status: z.string(),
      conclusion: z.string().nullable(),
    }),
  ),
});
const jobsSchema = z.object({
  jobs: z.array(
    z.object({
      name: z.string(),
      conclusion: z.string().nullable(),
    }),
  ),
});
const releaseSchema = z.object({
  id: z.number().int().positive(),
  tag_name: z.string(),
  draft: z.boolean(),
});

function requireCheckedSource(sha: string, github: ReleaseGitHub): void {
  const runs = runsSchema.parse(
    github.get(
      `actions/runs?head_sha=${sha}&event=push&status=completed&per_page=` +
        RELEASE_SOURCE_POLICY.pageSize,
    ),
  );
  for (const run of runs.workflow_runs) {
    if (
      run.head_sha !== sha ||
      run.path !== RELEASE_SOURCE_POLICY.workflow ||
      run.status !== 'completed'
    )
      continue;
    const jobs = jobsSchema.parse(
      github.get(
        `actions/runs/${run.id}/jobs?per_page=${RELEASE_SOURCE_POLICY.pageSize}`,
      ),
    );
    if (
      jobs.jobs.some(
        (job) =>
          job.name === RELEASE_SOURCE_POLICY.checkJob && job.conclusion === 'success',
      )
    )
      return;
  }
  throw new Error('Release recovery requires a successful complete Check.');
}

export function resolveRecoveryRelease(input: unknown, github: ReleaseGitHub) {
  const context = contextSchema.parse(input);
  const sha = resolveReleaseTag(context.tag, github);
  const comparison = z
    .object({ status: z.string() })
    .parse(github.get(`compare/${sha}...${context.workflowSha}`));
  if (!['ahead', 'identical'].includes(comparison.status)) {
    throw new Error('Release recovery rejected the main history.');
  }
  const releases = z
    .array(releaseSchema)
    .parse(github.get(`releases?per_page=${RELEASE_SOURCE_POLICY.pageSize}`));
  const release = releases.find((item) => item.tag_name === context.tag);
  if (!release) {
    throw new Error('Release recovery rejected the tag identity.');
  }
  for (const source of new Set([sha, context.workflowSha])) {
    requireCheckedSource(source, github);
  }
  if (!release.draft) github.patch(`releases/${release.id}`, { draft: true });
  return { sha, tag: context.tag, version: context.tag.slice(1), id: release.id };
}
