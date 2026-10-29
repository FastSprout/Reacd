import { describe, expect, it } from 'vitest';
import { parseReleaseEnvironment } from './verify-environment.js';

const sha = 'a'.repeat(40);
function environment() {
  return {
    RELEASE_SHA: sha,
    RELEASE_TAG: 'v0.1.0',
    RELEASE_VERSION: '0.1.0',
    GITHUB_SHA: sha,
    GITHUB_REPOSITORY: 'FastSprout/Reacd',
    GITHUB_ACTIONS: 'true',
    RUNNER_ENVIRONMENT: 'github-hosted',
    NPM_PUBLISH_ENABLED: 'true',
    ACTIONS_ID_TOKEN_REQUEST_URL: 'https://example.actions.githubusercontent.com',
    ACTIONS_ID_TOKEN_REQUEST_TOKEN: 'secret-never-print',
  };
}

describe('release environment identity', () => {
  it('returns only nonsecret release identity', () => {
    expect(parseReleaseEnvironment(environment())).toEqual({
      sha, tag: 'v0.1.0', version: '0.1.0',
    });
  });

  it.each([
    ...Object.keys(environment()).map((key) => ({ [key]: undefined })),
    { RELEASE_SHA: 'main' },
    { GITHUB_SHA: 'b'.repeat(40) },
    { RELEASE_VERSION: 'invalid' },
    { RELEASE_TAG: 'v0.2.0' },
    { GITHUB_REPOSITORY: 'other/Reacd' },
    { GITHUB_ACTIONS: 'false' },
    { RUNNER_ENVIRONMENT: 'self-hosted' },
    { NPM_PUBLISH_ENABLED: 'TRUE' },
    { ACTIONS_ID_TOKEN_REQUEST_URL: 'not a URL' },
    { ACTIONS_ID_TOKEN_REQUEST_URL: 'http://example.com' },
    { ACTIONS_ID_TOKEN_REQUEST_TOKEN: ' ' },
  ])('fails closed without exposing environment values: %j', (change) => {
    const action = () => parseReleaseEnvironment({ ...environment(), ...change });
    expect(action).toThrow('Release verification');
    expect(action).not.toThrow('secret-never-print');
  });
});
