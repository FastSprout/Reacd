import { appendFileSync } from 'node:fs';
import { readReleaseSnapshot } from '../tooling/release/complete.js';
import { createReleaseGitHub } from '../tooling/release/github-client.js';
import { resolveRecoveryRelease } from '../tooling/release/recovery.js';

if (process.env['NPM_PUBLISH_ENABLED'] !== 'true') {
  throw new Error('Release recovery requires enabled npm publication.');
}
const output = process.env['GITHUB_OUTPUT'];
if (!output) throw new Error('Release recovery requires a job output destination.');
const identity = resolveRecoveryRelease(
  {
    tag: process.env['RECOVERY_TAG'],
    workflowSha: process.env['GITHUB_SHA'],
    event: process.env['GITHUB_EVENT_NAME'],
    ref: process.env['GITHUB_REF'],
    actions: process.env['GITHUB_ACTIONS'],
    repository: process.env['GITHUB_REPOSITORY'],
    runner: process.env['RUNNER_ENVIRONMENT'],
  },
  createReleaseGitHub(),
);
appendFileSync(
  output,
  [
    'release_created=true',
    `release_id=${identity.id}`,
    `details=${JSON.stringify(
      readReleaseSnapshot(
        { ...identity, releaseId: identity.id },
        createReleaseGitHub(),
      ),
    )}`,
    `sha=${identity.sha}`,
    `checked_sha=${identity.sha}`,
    `tag_name=${identity.tag}`,
    `version=${identity.version}`,
    'publish_enabled=true',
  ].join('\n') + '\n',
);
console.log(`Checked release recovery prepared: ${identity.tag}.`);
