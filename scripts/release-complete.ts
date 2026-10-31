import { readReleaseCandidate } from '../tooling/release/candidate.js';
import { completeRelease } from '../tooling/release/complete.js';
import { createReleaseGitHub } from '../tooling/release/github-client.js';
import { parseReleaseIdentity } from '../tooling/release/verify-environment.js';

const root = new URL('../', import.meta.url);
const identity = parseReleaseIdentity(process.env);
await completeRelease(
  identity,
  readReleaseCandidate(root, identity),
  createReleaseGitHub(),
);
console.log(`GitHub and all npm packages are verified: ${identity.tag}.`);
