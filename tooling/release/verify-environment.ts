import { isReleaseVersion, PUBLICATION_POLICY } from './policy.js';

export interface ReleaseIdentity {
  readonly sha: string;
  readonly tag: string;
  readonly version: string;
}

type Environment = Readonly<Record<string, string | undefined>>;

function prerequisite(condition: boolean, field: string): void {
  if (!condition) {
    throw new Error(`Release verification prerequisite failed: ${field}.`);
  }
}

function required(environment: Environment, field: string): string {
  const value = environment[field];
  if (value === undefined || value.trim().length === 0) {
    throw new Error(`Release verification requires ${field}.`);
  }
  return value;
}

export function parseReleaseEnvironment(input: Environment): ReleaseIdentity {
  const sha = required(input, 'RELEASE_SHA');
  const tag = required(input, 'RELEASE_TAG');
  const version = required(input, 'RELEASE_VERSION');
  prerequisite(/^[a-f0-9]{40}$/.test(sha), 'RELEASE_SHA');
  prerequisite(sha === required(input, 'GITHUB_SHA'), 'GITHUB_SHA');
  prerequisite(isReleaseVersion(version), 'RELEASE_VERSION');
  prerequisite(tag === `v${version}`, 'RELEASE_TAG');
  prerequisite(input['GITHUB_ACTIONS'] === 'true', 'GITHUB_ACTIONS');
  prerequisite(
    input['GITHUB_REPOSITORY'] === PUBLICATION_POLICY.githubRepository,
    'GITHUB_REPOSITORY',
  );
  prerequisite(input['RUNNER_ENVIRONMENT'] === 'github-hosted', 'RUNNER_ENVIRONMENT');
  prerequisite(input['NPM_PUBLISH_ENABLED'] === 'true', 'NPM_PUBLISH_ENABLED');
  const url = required(input, 'ACTIONS_ID_TOKEN_REQUEST_URL');
  let secureUrl = false;
  try {
    secureUrl = new URL(url).protocol === 'https:';
  } catch {
    throw new Error('Release verification requires a valid OIDC request URL.');
  }
  prerequisite(secureUrl, 'OIDC HTTPS request URL');
  required(input, 'ACTIONS_ID_TOKEN_REQUEST_TOKEN');
  return { sha, tag, version };
}
